const express = require('express');
const eligibilityRoutes = require('../modules/eligibility/eligibility.routes');
const claimsRoutes = require('../modules/claims/claims.routes');
const authRoutes = require('../modules/auth/auth.routes');
const contentRoutes = require('../modules/admin/content.routes');
const usersRoutes = require('../modules/admin/users.routes');
const auditLogsRoutes = require('../modules/admin/auditLogs.routes');

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.use('/auth', authRoutes);
router.use('/eligibility', eligibilityRoutes);
router.use('/claims', claimsRoutes);
router.use('/admin/content', contentRoutes);
router.use('/admin/users', usersRoutes);
router.use('/admin/audit-logs', auditLogsRoutes);

// À ajouter en phase suivante :
// router.use('/appeals', appealsRoutes);

module.exports = router;
