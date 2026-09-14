from typing import List, Optional
from pydantic import BaseModel, Field

class LineItem(BaseModel):
    cpt_code: str = Field(..., description="Code de procédure (ex: 99214)")
    icd10_codes: List[str] = Field(..., description="Codes diagnostiques (ex: E11.9)")
    charge_amount: float
    units: int = 1

class ClaimCreate(BaseModel):
    claim_id: str
    patient_id: str
    provider_npi: str = Field(..., description="National Provider Identifier (10 chiffres)")
    payer_id: str
    line_items: List[LineItem]

class ValidationError(BaseModel):
    field: str
    error_code: str
    message: str

class ScrubbingResult(BaseModel):
    is_valid: bool
    errors: List[ValidationError]

class ClaimService:
    @staticmethod
    def scrub_claim(claim: ClaimCreate) -> ScrubbingResult:
        """Détecte les erreurs courantes de facturation avant la soumission."""
        errors = []

        # Rule 1: Validation Format NPI (10 chiffres)
        if not (claim.provider_npi.isdigit() and len(claim.provider_npi) == 10):
            errors.append(ValidationError(
                field="provider_npi",
                error_code="INVALID_NPI",
                message="Le Provider NPI doit contenir exactement 10 chiffres."
            ))

        # Rule 2: Validation des items de la facture
        if not claim.line_items:
            errors.append(ValidationError(
                field="line_items",
                error_code="EMPTY_CLAIM",
                message="La demande de remboursement doit contenir au moins une ligne de service."
            ))

        for idx, item in enumerate(claim.line_items):
            # Checking valid CPT format (5 chars)
            if len(item.cpt_code) != 5:
                errors.append(ValidationError(
                    field=f"line_items[{idx}].cpt_code",
                    error_code="INVALID_CPT",
                    message=f"Code CPT invalide : '{item.cpt_code}'."
                ))
            
            # Check ICD-10 association
            if not item.icd10_codes:
                errors.append(ValidationError(
                    field=f"line_items[{idx}].icd10_codes",
                    error_code="MISSING_DIAGNOSIS",
                    message="Chaque procédure CPT doit être associée à au moins un code diagnostique ICD-10."
                ))

        return ScrubbingResult(is_valid=(len(errors) == 0), errors=errors)

    @staticmethod
    def generate_cms1500_format(claim: ClaimCreate) -> str:
        """Génère une représentation textuelle standard structurée CMS-1500."""
        output = [
            "=== CMS-1500 HEALTH INSURANCE CLAIM FORM ===",
            f"1. PAYER ID: {claim.payer_id}",
            f"2. PATIENT ID: {claim.patient_id}",
            f"33. PHYSICIAN NPI: {claim.provider_npi}",
            "--- SERVICES PROVIDED ---"
        ]
        for item in claim.line_items:
            diags = ", ".join(item.icd10_codes)
            output.append(f"CPT: {item.cpt_code} | Diag Pointers: [{diags}] | Units: {item.units} | Charge: ${item.charge_amount:.2f}")
        
        return "\n".join(output)
