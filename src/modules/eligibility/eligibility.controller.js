const { runEligibilityCheck, getEligibilityHistory } = require('./eligibility.service');

async function checkEligibility(req, res, next) {
  try {
    const { patientId, policyId } = req.body;
    if (!patientId || !policyId) {
      return res.status(400).json({ error: 'patientId et policyId requis' });
    }

    const result = await runEligibilityCheck({
      patientId,
      policyId,
      requestedBy: req.user._id,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function history(req, res, next) {
  try {
    const results = await getEligibilityHistory(req.params.patientId);
    res.json(results);
  } catch (err) {
    next(err);
  }
}

module.exports = { checkEligibility, history };
