const express = require('express');
const { auth } = require('../../middleware/auth');
const auditLogger = require('../../middleware/auditLogger');
const { create, revalidate, submit, get, list } = require('./claims.controller');

const router = express.Router();

router.get('/', auth, list);
router.post(
  '/',
  auth,
  auditLogger('claim.create', 'Claim', (req, res) => res.locals.claimId),
  create
);
router.get('/:id', auth, get);
router.post('/:id/revalidate', auth, revalidate);
router.post(
  '/:id/submit',
  auth,
  auditLogger('claim.submit', 'Claim', (req) => req.params.id),
  submit
);

module.exports = router;
