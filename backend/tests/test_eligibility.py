import pytest
from datetime import date
from app.schemas.eligibility import EligibilityCheckRequest
from app.services.eligibility import EligibilityService

@pytest.mark.asyncio
async def test_verify_eligibility_active():
    req = EligibilityCheckRequest(
        patient_id="PAT-1001",
        first_name="John",
        last_name="Doe",
        date_of_birth=date(1985, 5, 20),
        payer_id="60054",
        policy_number="POL-998877"
    )
    res = await EligibilityService.verify_eligibility(req)
    assert res.is_active is True
    assert res.copay.amount == 25.00
    assert res.rejection_reason is None

@pytest.mark.asyncio
async def test_verify_eligibility_invalid_policy():
    req = EligibilityCheckRequest(
        patient_id="PAT-1002",
        first_name="Jane",
        last_name="Smith",
        date_of_birth=date(1990, 1, 1),
        payer_id="60054",
        policy_number="INVALID_POL"
    )
    res = await EligibilityService.verify_eligibility(req)
    assert res.is_active is False
    assert res.rejection_reason == "Policy Terminated or Patient Not Found"
