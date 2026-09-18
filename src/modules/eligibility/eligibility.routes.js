const express = require('express');
const { auth } = require('../../middleware/auth');
const auditLogger = require('../../middleware/auditLogger');
const { checkEligibility, history } = require('./eligibility.controller');

const router = express.Router();

router.post(
  '/check',
  auth,
  auditLogger('eligibility.check', 'Patient', (req) => req.body.patientId),
  checkEligibility
);

router.get('/history/:patientId', auth, history);

module.exports = router;
