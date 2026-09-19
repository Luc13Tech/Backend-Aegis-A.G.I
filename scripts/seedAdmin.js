/**
 * Usage : node scripts/seedAdmin.js "Nom Complet" "email@clinique.com" "motDePasseFort"
 * À lancer une seule fois (en local, avec MONGODB_URI pointant vers la base de prod ou dev)
 * pour créer le premier compte admin. Les comptes suivants se créent depuis l'interface admin.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

async function main() {
  const [name, email, password] = process.argv.slice(2);
  if (!name || !email || !password) {
    console.error('Usage: node scripts/seedAdmin.js "Nom" "email" "motDePasse"');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log('Un utilisateur avec cet email existe déjà.');
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ name, email: email.toLowerCase(), passwordHash, role: 'admin' });

  console.log(`Compte admin créé pour ${email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
