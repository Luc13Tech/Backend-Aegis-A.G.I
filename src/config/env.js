const REQUIRED_VARS = [
  'MONGODB_URI',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`[env] Variables manquantes: ${missing.join(', ')}`);
    process.exit(1);
  }
  console.log('[env] Variables d\'environnement validées');
}

module.exports = validateEnv;
