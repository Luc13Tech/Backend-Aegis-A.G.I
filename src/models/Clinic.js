const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    npi: { type: String, required: true, unique: true }, // National Provider Identifier
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
    phone: String,
    taxId: { type: String, select: false }, // sensible — exclu par défaut des requêtes
  },
  { timestamps: true }
);

module.exports = mongoose.model('Clinic', clinicSchema);
