const AuditLog = require('../models/AuditLog');

/**
 * Usage: router.post('/', auth, auditLogger('eligibility.check', 'Patient', req => req.body.patientId), controller)
 * Écrit un log après la réponse, uniquement si la requête a réussi (2xx).
 */
function auditLogger(action, resourceType, getResourceId) {
  return (req, res, next) => {
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
        const resourceId = typeof getResourceId === 'function' ? getResourceId(req, res) : null;
        if (resourceId) {
          AuditLog.create({
            user: req.user._id,
            action,
            resourceType,
            resourceId,
            ipAddress: req.ip,
          }).catch((err) => console.error('[auditLog] échec écriture:', err.message));
        }
      }
    });
    next();
  };
}

module.exports = auditLogger;
