const mongoose = require('mongoose');

async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI manquant dans les variables d\'environnement');
    }
    await mongoose.connect(uri);
    console.log('[db] Connecté à MongoDB');
  } catch (err) {
    console.error('[db] Échec de connexion à MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
