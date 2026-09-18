const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
    policy: { type: mongoose.Schema.Types.ObjectId, ref: 'InsurancePolicy', required: true },

    format: { type: String, enum: ['CMS-1500', 'UB-04', 'X12-837'], required: true },

    cptCodes: [{ code: String, description: String, units: { type: Number, default: 1 } }],
    icd10Codes: [{ code: String, description: String }],

    dateOfService: { type: Date, required: true },
    billedAmount: { type: Number, required: true },
    allowedAmount: Number,
    paidAmount: Number,

    status: {
      type: String,
      enum: ['draft', 'ready', 'submitted', 'accepted', 'rejected', 'appealed', 'paid'],
      default: 'draft',
    },

    submittedAt: Date,
    lastStatusCheckAt: Date,
    rejectionReason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Claim', claimSchema);
