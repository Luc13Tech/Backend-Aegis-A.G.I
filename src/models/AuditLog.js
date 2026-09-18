const mongoose = require('mongoose');

/**
 * Journal d'audit HIPAA : ne stocke que des identifiants (ObjectId),
 * jamais de nom, diagnostic ou donnée patient en clair.
 */
const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // ex: "eligibility.check", "claim.submit"
    resourceType: { type: String, required: true }, // ex: "Patient", "Claim"
    resourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
    ipAddress: String,
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

auditLogSchema.index({ resourceType: 1, resourceId: 1 });
auditLogSchema.index({ user: 1, timestamp: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
