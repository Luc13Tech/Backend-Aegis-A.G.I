const mongoose = require('mongoose');

const eligibilityCheckSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    policy: { type: mongoose.Schema.Types.ObjectId, ref: 'InsurancePolicy', required: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['covered', 'not_covered', 'partial', 'pending', 'error'],
      required: true,
    },
    copay: Number,
    coinsurance: Number, // pourcentage
    deductibleRemaining: Number,
    outOfPocketMax: Number,
    notes: String,
    rawResponse: mongoose.Schema.Types.Mixed, // réponse brute du provider (mock ou réel)
    checkedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EligibilityCheck', eligibilityCheckSchema);
