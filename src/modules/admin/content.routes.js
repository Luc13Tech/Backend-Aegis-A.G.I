const express = require('express');
const { auth, requireRole } = require('../../middleware/auth');
const auditLogger = require('../../middleware/auditLogger');
const { list, upsert } = require('./content.controller');

const router = express.Router();

router.get('/', auth, requireRole('admin'), list);
router.put(
  '/:key',
  auth,
  requireRole('admin'),
  auditLogger('content.update', 'SiteContent', (req, res) => res.locals.contentId),
  upsert
);

module.exports = router;
