const express = require('express');
const { auth, requireRole } = require('../../middleware/auth');
const auditLogger = require('../../middleware/auditLogger');
const { list, create, update } = require('./users.controller');

const router = express.Router();

router.get('/', auth, requireRole('admin'), list);
router.post(
  '/',
  auth,
  requireRole('admin'),
  auditLogger('user.create', 'User', (req, res) => res.locals.userId),
  create
);
router.patch(
  '/:id',
  auth,
  requireRole('admin'),
  auditLogger('user.update', 'User', (req) => req.params.id),
  update
);

module.exports = router;
