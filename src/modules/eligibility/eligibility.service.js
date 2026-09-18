const EligibilityCheck = require('../../models/EligibilityCheck');
const InsurancePolicy = require('../../models/InsurancePolicy');
const { checkEligibilityMock } = require('./eligibility.mockProvider');

async function runEligibilityCheck({ patientId, policyId, requestedBy }) {
  const policy = await InsurancePolicy.findById(policyId);
  if (!policy) {
    const err = new Error('Police d\'assurance introuvable');
    err.status = 404;
    throw err;
  }

  const result = await checkEligibilityMock(policy);

  const check = await EligibilityCheck.create({
    patient: patientId,
    policy: policyId,
    requestedBy,
    ...result,
  });

  return check;
}

async function getEligibilityHistory(patientId) {
  return EligibilityCheck.find({ patient: patientId }).sort({ checkedAt: -1 });
}

module.exports = { runEligibilityCheck, getEligibilityHistory };
