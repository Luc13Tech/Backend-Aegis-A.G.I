const express = require('express');
const eligibilityRoutes = require('../modules/eligibility/eligibility.routes');
const claimsRoutes = require('../modules/claims/claims.routes');

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

router.use('/eligibility', eligibilityRoutes);
router.use('/claims', claimsRoutes);

// À ajouter au fil des phases suivantes :
// router.use('/appeals', appealsRoutes);
// router.use('/admin/content', siteContentRoutes);
// router.use('/admin/audit-logs', auditLogRoutes);
// router.use('/auth', authRoutes);

module.exports = router;
