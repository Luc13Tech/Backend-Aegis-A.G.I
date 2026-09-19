const { getRecentLogs } = require('../auditLog/auditLog.service');

async function list(req, res, next) {
  try {
    const { resourceType, userId, limit } = req.query;
    const logs = await getRecentLogs({ resourceType, userId, limit: limit ? Number(limit) : 100 });
    res.json(logs);
  } catch (err) {
    next(err);
  }
}

module.exports = { list };
