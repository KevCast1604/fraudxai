"""
API v1 Router Registration
GIBC V2 Hackathon - Track 02: Applied (Finance)
"""

from fastapi import APIRouter

try:
    from app.api.v1.endpoints.analyze import router as analyze_router
except ModuleNotFoundError:
    from backend.app.api.v1.endpoints.analyze import router as analyze_router

api_router = APIRouter()
api_router.include_router(analyze_router, prefix="", tags=["Fraud Analysis & Compliance"])
