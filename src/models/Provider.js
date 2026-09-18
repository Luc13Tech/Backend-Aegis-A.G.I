const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema(
  {
    clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    npi: { type: String, required: true, unique: true },
    specialty: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Provider', providerSchema);
