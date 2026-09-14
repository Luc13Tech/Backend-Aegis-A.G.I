from fastapi import APIRouter
from app.api.v1.endpoints import eligibility, claims

api_router = APIRouter()
api_router.include_router(eligibility.router, prefix="/eligibility", tags=["Eligibility"])
api_router.include_router(claims.router, prefix="/claims", tags=["Claims"])
