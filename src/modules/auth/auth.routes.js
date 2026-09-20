const express = require('express');

const { auth } = require('../../middleware/auth');
const { login, me } = require('./auth.controller');
const { showForm, createFirstAdmin } = require('./bootstrap.controller');

const {
  showResetForm,
  resetAdmin
} = require('./reset-admin.controller');

const router = express.Router();

router.post('/login', login);

router.get('/me', auth, me);

// Création du tout premier compte admin
router.get('/bootstrap-admin', showForm);
router.post('/bootstrap-admin', createFirstAdmin);

// Récupération du compte admin en cas d'oubli du mot de passe
router.get('/reset-admin', showResetForm);
router.post('/reset-admin', resetAdmin);

module.exports = router;
