from datetime import date
from typing import Optional

from pydantic import BaseModel, Field


class EligibilityCheckRequest(BaseModel):
    patient_id: str
    first_name: str
    last_name: str
    date_of_birth: date
    payer_id: str = Field(
        ...,
        description="ID de l'assureur (ex: 60054 pour Aetna)"
    )
    policy_number: str
    service_type_code: str = Field(
        default="30",
        description="30 = Health Benefit Coverage General"
    )


class CoPayInfo(BaseModel):
    service_type: str
    amount: float
    in_network: bool


class EligibilityCheckResponse(BaseModel):
    patient_id: str
    is_active: bool
    payer_name: str
    coverage_start_date: date
    coverage_end_date: Optional[date] = None
    deductible_remaining: float
    out_of_pocket_max_remaining: float
    copay: CoPayInfo
    rejection_reason: Optional[str] = None
