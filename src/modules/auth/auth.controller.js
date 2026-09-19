const { loginUser } = require('./auth.service');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }
    const result = await loginUser(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Retourne l'utilisateur courant à partir du token — utile pour restaurer la session côté frontend
async function me(req, res) {
  const { _id, name, email, role, clinic } = req.user;
  res.json({ id: _id, name, email, role, clinic });
}

module.exports = { login, me };
