from app.schemas.claim import ClaimCreate, LineItem
from app.services.scrubber import ClaimService

def test_claim_scrubber_valid():
    claim = ClaimCreate(
        claim_id="CLM-001",
        patient_id="PAT-1001",
        provider_npi="1234567890",
        payer_id="PAYER-99",
        line_items=[
            LineItem(cpt_code="99214", icd10_codes=["E11.9"], charge_amount=150.0)
        ]
    )
    result = ClaimService.scrub_claim(claim)
    assert result.is_valid is True
    assert len(result.errors) == 0

def test_claim_scrubber_invalid_npi_and_cpt():
    claim = ClaimCreate(
        claim_id="CLM-002",
        patient_id="PAT-1001",
        provider_npi="1234",  # Invalide (< 10 chiffres)
        payer_id="PAYER-99",
        line_items=[
            LineItem(cpt_code="INVALID", icd10_codes=[], charge_amount=150.0)  # CPT invalide et ICD-10 manquant
        ]
    )
    result = ClaimService.scrub_claim(claim)
    assert result.is_valid is False
    assert len(result.errors) == 3
