const AuditLog = require('../../models/AuditLog');

async function getRecentLogs({ limit = 100, resourceType, userId } = {}) {
  const filter = {};
  if (resourceType) filter.resourceType = resourceType;
  if (userId) filter.user = userId;

  return AuditLog.find(filter)
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('user', 'name email role');
}

module.exports = { getRecentLogs };
