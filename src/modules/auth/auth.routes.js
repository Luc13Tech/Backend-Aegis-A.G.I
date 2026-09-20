const express = require('express');
const { auth } = require('../../middleware/auth');
const { login, me } = require('./auth.controller');
const { showForm, createFirstAdmin } = require('./bootstrap.controller');

const router = express.Router();

router.post('/login', login);
router.get('/me', auth, me);

// Formulaire web de création du tout premier compte admin (auto-désactivé une fois utilisé)
router.get('/bootstrap-admin', showForm);
router.post('/bootstrap-admin', createFirstAdmin);

module.exports = router;
