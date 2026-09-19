const express = require('express');
const { auth, requireRole } = require('../../middleware/auth');
const { list } = require('./auditLogs.controller');

const router = express.Router();

router.get('/', auth, requireRole('admin'), list);

module.exports = router;
