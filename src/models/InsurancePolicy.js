const mongoose = require('mongoose');

const insurancePolicySchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    payerName: { type: String, required: true }, // ex: "Blue Cross Blue Shield"
    payerId: { type: String, required: true },
    memberId: { type: String, required: true },
    groupNumber: String,
    planType: { type: String, enum: ['PPO', 'HMO', 'EPO', 'POS', 'Medicare', 'Medicaid'] },
    effectiveDate: Date,
    terminationDate: Date,
    isPrimary: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InsurancePolicy', insurancePolicySchema);
