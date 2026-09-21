"""
FraudxAI Configuration & Settings
GIBC V2 Hackathon - Track 02: Applied (Finance)
"""

import os
from typing import List
from dotenv import load_dotenv

# Load .env from backend or root directory
load_dotenv()


class Settings:
    PROJECT_NAME: str = "FraudxAI: Explainable AI for Risk & Compliance"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"

    # LLM Providers Configuration
    FEATHERLESS_API_KEY: str = os.getenv("FEATHERLESS_API_KEY", "").strip()
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "").strip()
    ADAPTION_API_KEY: str = os.getenv("ADAPTION_API_KEY", "").strip()

    # Endpoints
    FEATHERLESS_BASE_URL: str = os.getenv("FEATHERLESS_BASE_URL", "https://api.featherless.ai/v1")
    GROQ_BASE_URL: str = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
    ADAPTION_BASE_URL: str = os.getenv("ADAPTION_BASE_URL", "https://api.adaption.ai/v1")

    # Models
    FEATHERLESS_MODEL: str = os.getenv("FEATHERLESS_MODEL", "Qwen/Qwen2.5-7B-Instruct")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")
    ADAPTION_MODEL: str = os.getenv("ADAPTION_MODEL", "Qwen/Qwen2.5-7B-Instruct")

    # Provider Priority (e.g. "groq", "featherless", "adaption")
    PRIMARY_PROVIDER: str = os.getenv("PRIMARY_PROVIDER", "groq")

    # Timeout Budgets (in seconds)
    LLM_TIMEOUT_PRIMARY: float = float(os.getenv("LLM_TIMEOUT_PRIMARY", "75.0"))
    LLM_TIMEOUT_FALLBACK: float = float(os.getenv("LLM_TIMEOUT_FALLBACK", "10.0"))

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "*"
    ]


settings = Settings()
