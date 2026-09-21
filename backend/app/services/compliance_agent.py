"""
FraudxAI - Resilient Multi-Provider Compliance LLM Agent
GIBC V2 Hackathon - Track 02: Applied (Finance)

Orchestrates automated compliance memo generation across multiple providers:
1. Groq Cloud (Ultra-Fast LPUs, ~1.2s latency)
2. Featherless.ai (Meta-Llama / Qwen / Mistral catalog)
3. Adaption Labs (when configured)
4. Deterministic Offline Template (Zero-failure safety net)
"""

import logging
import os
import time
from typing import Dict, Any, List, Optional
from dotenv import load_dotenv
import httpx

try:
    from app.core.config import settings
    from app.schemas.transaction import TransactionInput, ShapFactor, AuditTelemetry
    from app.services.prompt_templates import (
        SYSTEM_COMPLIANCE_PROMPT,
        build_compliance_user_prompt,
        build_deterministic_offline_memo,
    )
except ModuleNotFoundError:
    from backend.app.core.config import settings
    from backend.app.schemas.transaction import TransactionInput, ShapFactor, AuditTelemetry
    from backend.app.services.prompt_templates import (
        SYSTEM_COMPLIANCE_PROMPT,
        build_compliance_user_prompt,
        build_deterministic_offline_memo,
    )

logger = logging.getLogger("fraudxai.compliance_agent")


class ComplianceAgent:
    def _get_config(self):
        # Reload environment variables to pick up any runtime edits to .env
        load_dotenv(override=True)
        return {
            "primary_provider": os.getenv("PRIMARY_PROVIDER", settings.PRIMARY_PROVIDER).lower().strip(),
            "groq_key": os.getenv("GROQ_API_KEY", settings.GROQ_API_KEY).strip(),
            "groq_base_url": os.getenv("GROQ_BASE_URL", settings.GROQ_BASE_URL).strip(),
            "groq_model": os.getenv("GROQ_MODEL", settings.GROQ_MODEL).strip(),
            "featherless_key": os.getenv("FEATHERLESS_API_KEY", settings.FEATHERLESS_API_KEY).strip(),
            "featherless_base_url": os.getenv("FEATHERLESS_BASE_URL", settings.FEATHERLESS_BASE_URL).strip(),
            "featherless_model": os.getenv("FEATHERLESS_MODEL", settings.FEATHERLESS_MODEL).strip(),
            "adaption_key": os.getenv("ADAPTION_API_KEY", settings.ADAPTION_API_KEY).strip(),
            "adaption_base_url": os.getenv("ADAPTION_BASE_URL", settings.ADAPTION_BASE_URL).strip(),
            "adaption_model": os.getenv("ADAPTION_MODEL", settings.ADAPTION_MODEL).strip(),
            "timeout_primary": float(os.getenv("LLM_TIMEOUT_PRIMARY", "15.0")),
            "timeout_fallback": float(os.getenv("LLM_TIMEOUT_FALLBACK", "45.0")),
        }

    async def generate_compliance_memo(
        self,
        audit_id: str,
        timestamp: str,
        tx: TransactionInput,
        risk_score: float,
        risk_tier: str,
        regulatory_action: str,
        base_value: float,
        shap_factors: List[ShapFactor],
    ) -> Dict[str, Any]:
        start_time = time.perf_counter()
        config = self._get_config()

        user_prompt = build_compliance_user_prompt(
            audit_id=audit_id,
            timestamp=timestamp,
            tx=tx,
            risk_score=risk_score,
            risk_tier=risk_tier,
            regulatory_action=regulatory_action,
            base_value=base_value,
            shap_factors=shap_factors,
        )

        # Build candidate providers list based on PRIMARY_PROVIDER preference
        primary = config["primary_provider"]
        if primary == "groq":
            provider_order = ["groq", "featherless", "adaption"]
        elif primary == "adaption":
            provider_order = ["adaption", "groq", "featherless"]
        else:
            provider_order = ["featherless", "groq", "adaption"]

        fallback_reasons: List[str] = []
        attempted_count = 0

        for provider in provider_order:
            attempted_count += 1
            is_fallback = (attempted_count > 1)

            if provider == "groq":
                key = config["groq_key"]
                if not key:
                    fallback_reasons.append("GROQ_API_KEY not configured")
                    continue
                try:
                    logger.info(f"Invoking Groq Cloud (Model: {config['groq_model']})...")
                    timeout = httpx.Timeout(connect=3.0, read=12.0, write=3.0, pool=3.0)
                    content = await self._call_openai_compatible(
                        base_url=config["groq_base_url"],
                        api_key=key,
                        model=config["groq_model"],
                        system_prompt=SYSTEM_COMPLIANCE_PROMPT,
                        user_prompt=user_prompt,
                        timeout=timeout,
                    )
                    latency_ms = int((time.perf_counter() - start_time) * 1000)
                    return {
                        "memo": content,
                        "telemetry": AuditTelemetry(
                            provider="groq",
                            model=config["groq_model"],
                            latency_ms=latency_ms,
                            fallback_triggered=is_fallback,
                            fallback_reason="; ".join(fallback_reasons) if is_fallback else None,
                        ),
                    }
                except Exception as exc:
                    err = f"Groq ({config['groq_model']}) failed: {str(exc)}"
                    logger.warning(err)
                    fallback_reasons.append(err)

            elif provider == "featherless":
                key = config["featherless_key"]
                if not key:
                    fallback_reasons.append("FEATHERLESS_API_KEY not configured")
                    continue
                try:
                    logger.info(f"Invoking Featherless.ai (Model: {config['featherless_model']})...")
                    timeout = httpx.Timeout(connect=5.0, read=config["timeout_primary"], write=5.0, pool=5.0)
                    content = await self._call_openai_compatible(
                        base_url=config["featherless_base_url"],
                        api_key=key,
                        model=config["featherless_model"],
                        system_prompt=SYSTEM_COMPLIANCE_PROMPT,
                        user_prompt=user_prompt,
                        timeout=timeout,
                    )
                    latency_ms = int((time.perf_counter() - start_time) * 1000)
                    return {
                        "memo": content,
                        "telemetry": AuditTelemetry(
                            provider="featherless.ai",
                            model=config["featherless_model"],
                            latency_ms=latency_ms,
                            fallback_triggered=is_fallback,
                            fallback_reason="; ".join(fallback_reasons) if is_fallback else None,
                        ),
                    }
                except Exception as exc:
                    err = f"Featherless failed: {str(exc)}"
                    logger.warning(err)
                    fallback_reasons.append(err)

            elif provider == "adaption":
                key = config["adaption_key"]
                if not key:
                    continue
                try:
                    logger.info("Invoking Adaption Labs API...")
                    timeout = httpx.Timeout(connect=4.0, read=15.0, write=4.0, pool=4.0)
                    content = await self._call_openai_compatible(
                        base_url=config["adaption_base_url"],
                        api_key=key,
                        model=config["adaption_model"],
                        system_prompt=SYSTEM_COMPLIANCE_PROMPT,
                        user_prompt=user_prompt,
                        timeout=timeout,
                    )
                    latency_ms = int((time.perf_counter() - start_time) * 1000)
                    return {
                        "memo": content,
                        "telemetry": AuditTelemetry(
                            provider="adaption_labs",
                            model=config["adaption_model"],
                            latency_ms=latency_ms,
                            fallback_triggered=is_fallback,
                            fallback_reason="; ".join(fallback_reasons) if is_fallback else None,
                        ),
                    }
                except Exception as exc:
                    err = f"Adaption Labs failed: {str(exc)}"
                    logger.warning(err)
                    fallback_reasons.append(err)

        # Tier 4: Guaranteed Deterministic Offline Fallback
        logger.warning("All cloud providers unreachable. Rendering deterministic compliance memo.")
        offline_memo = build_deterministic_offline_memo(
            audit_id=audit_id,
            timestamp=timestamp,
            tx=tx,
            risk_score=risk_score,
            risk_tier=risk_tier,
            regulatory_action=regulatory_action,
            base_value=base_value,
            shap_factors=shap_factors,
        )
        latency_ms = int((time.perf_counter() - start_time) * 1000)

        return {
            "memo": offline_memo,
            "telemetry": AuditTelemetry(
                provider="deterministic_offline_engine",
                model="rule_based_v1.0",
                latency_ms=latency_ms,
                fallback_triggered=True,
                fallback_reason="; ".join(fallback_reasons) if fallback_reasons else "All providers failed",
            ),
        }

    async def _call_openai_compatible(
        self,
        base_url: str,
        api_key: str,
        model: str,
        system_prompt: str,
        user_prompt: str,
        timeout: httpx.Timeout,
    ) -> str:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.15,
            "max_tokens": 650,
        }
        async with httpx.AsyncClient(base_url=base_url, timeout=timeout) as client:
            resp = await client.post("/chat/completions", headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]


compliance_agent = ComplianceAgent()
