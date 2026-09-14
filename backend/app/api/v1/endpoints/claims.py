from fastapi import APIRouter, HTTPException, status
from app.schemas.claim import ClaimCreate, ScrubbingResult
from app.services.scrubber import ClaimService

router = APIRouter()

@router.post("/scrub", response_model=ScrubbingResult)
def scrub_claim(claim: ClaimCreate):
    """Effectue la détection d'erreurs (scrubbing) sur une demande de remboursement."""
    return ClaimService.scrub_claim(claim)

@router.post("/generate-cms1500")
def generate_cms1500(claim: ClaimCreate):
    """Génère le document textuel au format standard CMS-1500."""
    validation = ClaimService.scrub_claim(claim)
    if not validation.is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"message": "Impossible de générer la demande : des erreurs sont présentes.", "errors": [e.model_dump() for e in validation.errors]}
        )
    formatted_form = ClaimService.generate_cms1500_format(claim)
    return {"claim_id": claim.claim_id, "formatted_cms1500": formatted_form}
