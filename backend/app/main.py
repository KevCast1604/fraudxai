"""
FraudxAI - FastAPI Main Application
GIBC V2 Hackathon - Track 02: Applied (Finance)
"""

import os
import sys
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure sys.path contains backend directory
_backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _backend_dir not in sys.path:
    sys.path.insert(0, _backend_dir)

try:
    from app.core.config import settings
    from app.api.v1.router import api_router
except ModuleNotFoundError:
    from backend.app.core.config import settings
    from backend.app.api.v1.router import api_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("fraudxai.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up FraudxAI Engine...")
    logger.info(f"Loaded Primary LLM Provider: {settings.PRIMARY_PROVIDER}")
    yield
    logger.info("Shutting down FraudxAI Engine...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Explainable AI & Automated Regulatory Compliance Memo Generation for Risk Operations",
    lifespan=lifespan,
)

# CORS Configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "api_endpoint": f"{settings.API_V1_PREFIX}/analyze",
        "health_endpoint": f"{settings.API_V1_PREFIX}/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
