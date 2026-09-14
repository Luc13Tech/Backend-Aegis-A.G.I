from datetime import date
from app.schemas.eligibility import EligibilityCheckRequest, EligibilityCheckResponse, CoPayInfo

class EligibilityService:
    @staticmethod
    async def verify_eligibility(payload: EligibilityCheckRequest) -> EligibilityCheckResponse:
        """
        Simule une transaction X12 EDI 270/271 vers un clearinghouse d'assurance.
        """
        # Simulation d'un refus pour un test de couverture invalide
        if payload.policy_number.startswith("INVALID"):
            return EligibilityCheckResponse(
                patient_id=payload.patient_id,
                is_active=False,
                payer_name="Mock Payer Direct",
                coverage_start_date=date(2023, 1, 1),
                coverage_end_date=date(2023, 12, 31),
                deductible_remaining=0.0,
                out_of_pocket_max_remaining=0.0,
                copay=CoPayInfo(service_type="Office Visit", amount=0.0, in_network=False),
                rejection_reason="Policy Terminated or Patient Not Found"
            )

        # Réponse éligible par défaut
        return EligibilityCheckResponse(
            patient_id=payload.patient_id,
            is_active=True,
            payer_name="Blue Cross Blue Shield (Mock)",
            coverage_start_date=date(2026, 1, 1),
            coverage_end_date=date(2026, 12, 31),
            deductible_remaining=450.00,
            out_of_pocket_max_remaining=2100.00,
            copay=CoPayInfo(service_type="Office Visit", amount=25.00, in_network=True),
            rejection_reason=None
        )
