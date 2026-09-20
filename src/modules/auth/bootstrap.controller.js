const bcrypt = require('bcryptjs');
const User = require('../../models/User');

function formPage({ error } = {}) {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Aegis A.G.I. — Configuration initiale</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #0F172A; color: #fff; min-height: 100vh;
           display: flex; align-items: center; justify-content: center; margin: 0; }
    .box { background: #fff; color: #0F172A; padding: 32px; border-radius: 12px; width: 100%; max-width: 360px; }
    h1 { font-size: 20px; margin: 0 0 4px; }
    p.sub { color: #64748B; font-size: 14px; margin: 0 0 20px; }
    label { display: block; font-size: 13px; font-weight: 600; margin: 14px 0 4px; }
    input { width: 100%; padding: 10px; border: 1px solid #E2E8F0; border-radius: 8px; box-sizing: border-box; font-size: 15px; }
    button { margin-top: 20px; width: 100%; padding: 12px; background: #1D4ED8; color: #fff; border: none;
             border-radius: 8px; font-size: 15px; font-weight: 600; }
    .error { background: #FEF2F2; color: #DC2626; padding: 10px; border-radius: 8px; font-size: 13px; margin-bottom: 10px; }
  </style>
</head>
<body>
  <div class="box">
    <h1>Configuration initiale</h1>
    <p class="sub">Crée le premier compte administrateur d'Aegis A.G.I. Ce formulaire ne fonctionne qu'une seule fois.</p>
    ${error ? `<div class="error">${error}</div>` : ''}
    <form method="POST">
      <label>Nom complet</label>
      <input name="name" required />
      <label>Email</label>
      <input name="email" type="email" required />
      <label>Mot de passe</label>
      <input name="password" type="password" required minlength="8" />
      <button type="submit">Créer le compte admin</button>
    </form>
  </div>
</body>
</html>`;
}

function successPage(email) {
  return `<!doctype html>
<html lang="fr"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Compte créé</title>
<style>body{font-family:system-ui,sans-serif;background:#0F172A;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;margin:0;text-align:center;padding:24px;}
.box{background:#fff;color:#0F172A;padding:32px;border-radius:12px;max-width:360px;}
.ok{color:#16A34A;font-size:32px;}</style></head>
<body><div class="box"><div class="ok">✓</div>
<h1>Compte admin créé</h1>
<p>Connecte-toi maintenant avec <strong>${email}</strong> depuis la page de connexion de l'application.</p>
</div></body></html>`;
}

async function showForm(req, res, next) {
  try {
    const adminExists = await User.exists({ role: 'admin' });
    if (adminExists) {
      return res.status(403).send('<p style="font-family:sans-serif;padding:24px">Configuration déjà effectuée — un compte admin existe déjà.</p>');
    }
    res.send(formPage());
  } catch (err) {
    next(err);
  }
}

async function createFirstAdmin(req, res, next) {
  try {
    const adminExists = await User.exists({ role: 'admin' });
    if (adminExists) {
      return res.status(403).send('<p style="font-family:sans-serif;padding:24px">Configuration déjà effectuée — un compte admin existe déjà.</p>');
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).send(formPage({ error: 'Tous les champs sont requis (mot de passe : 8 caractères min.)' }));
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await User.create({ name, email: email.toLowerCase(), passwordHash, role: 'admin' });

    res.send(successPage(email));
  } catch (err) {
    next(err);
  }
}

module.exports = { showForm, createFirstAdmin };
