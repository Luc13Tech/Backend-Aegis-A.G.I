const mongoose = require('mongoose');

const claimErrorSchema = new mongoose.Schema(
  {
    claim: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim', required: true },
    field: { type: String, required: true }, // ex: "cptCodes[0]", "icd10Codes", "billedAmount"
    errorType: {
      type: String,
      enum: ['missing_field', 'invalid_code', 'code_mismatch', 'format_error', 'other'],
      required: true,
    },
    severity: { type: String, enum: ['blocking', 'warning'], required: true },
    message: { type: String, required: true },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClaimError', claimErrorSchema);
