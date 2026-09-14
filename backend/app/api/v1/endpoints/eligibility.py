from fastapi import APIRouter, HTTPException, status
from app.schemas.eligibility import EligibilityCheckRequest, EligibilityCheckResponse
from app.services.eligibility import EligibilityService

router = APIRouter()

@router.post("/check", response_model=EligibilityCheckResponse)
async def check_eligibility(payload: EligibilityCheckRequest):
    """Vérifie l'éligibilité d'un patient auprès de l'assureur (EDI 270/271 Mock)."""
    try:
        response = await EligibilityService.verify_eligibility(payload)
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la vérification d'éligibilité : {str(e)}"
        )
