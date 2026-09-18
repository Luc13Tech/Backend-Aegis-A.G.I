const mongoose = require('mongoose');

const appealSchema = new mongoose.Schema(
  {
    claim: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim', required: true },
    rejectionReason: { type: String, required: true },
    generatedLetter: String, // texte généré par l'IA (Claude)
    status: {
      type: String,
      enum: ['draft', 'ready_for_review', 'submitted', 'won', 'lost'],
      default: 'draft',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submittedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Appeal', appealSchema);
