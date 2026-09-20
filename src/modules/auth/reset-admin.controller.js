const bcrypt = require('bcryptjs');
const User = require('../../models/User');

function formPage({ error = '', success = '' } = {}) {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Aegis A.G.I. — Récupération Admin</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #0F172A;
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
      padding: 20px;
    }

    .box {
      background: #fff;
      color: #0F172A;
      padding: 32px;
      border-radius: 14px;
      width: 100%;
      max-width: 400px;
      box-sizing: border-box;
    }

    h1 {
      font-size: 21px;
      margin: 0 0 8px;
    }

    .sub {
      color: #64748B;
      font-size: 14px;
      margin-bottom: 22px;
      line-height: 1.5;
    }

    label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      margin: 15px 0 5px;
    }

    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      box-sizing: border-box;
      font-size: 15px;
    }

    button {
      margin-top: 22px;
      width: 100%;
      padding: 13px;
      background: #1D4ED8;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
    }

    .error {
      background: #FEF2F2;
      color: #DC2626;
      padding: 11px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 12px;
    }

    .success {
      background: #F0FDF4;
      color: #15803D;
      padding: 11px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 12px;
    }

    .warning {
      margin-top: 18px;
      color: #64748B;
      font-size: 12px;
      line-height: 1.5;
    }
  </style>
</head>

<body>
  <div class="box">
    <h1>Récupération du compte Admin</h1>

    <p class="sub">
      Utilise cette page uniquement pour récupérer ton compte administrateur
      lorsque tu as oublié ton mot de passe.
    </p>

    ${error ? `<div class="error">${error}</div>` : ''}
    ${success ? `<div class="success">${success}</div>` : ''}

    <form method="POST">

      <label>Clé de récupération</label>
      <input
        name="recoveryKey"
        type="password"
        required
        autocomplete="off"
      />

      <label>Nouvelle adresse e-mail</label>
      <input
        name="email"
        type="email"
        required
        autocomplete="email"
      />

      <label>Nouveau mot de passe</label>
      <input
        name="password"
        type="password"
        required
        minlength="8"
        autocomplete="new-password"
      />

      <label>Confirmer le nouveau mot de passe</label>
      <input
        name="confirmPassword"
        type="password"
        required
        minlength="8"
        autocomplete="new-password"
      />

      <button type="submit">
        Réinitialiser le compte administrateur
      </button>
    </form>

    <div class="warning">
      Cette opération remplace le mot de passe du compte administrateur.
      Ne partage jamais la clé de récupération.
    </div>
  </div>
</body>
</html>`;
}

async function showResetForm(req, res, next) {
  try {
    const admin = await User.findOne({ role: 'admin' });

    if (!admin) {
      return res.status(404).send(
        '<p style="font-family:sans-serif;padding:24px">Aucun compte administrateur trouvé.</p>'
      );
    }

    res.send(formPage());
  } catch (err) {
    next(err);
  }
}

async function resetAdmin(req, res, next) {
  try {
    const {
      recoveryKey,
      email,
      password,
      confirmPassword
    } = req.body;

    const expectedKey = process.env.ADMIN_RECOVERY_KEY;

    if (!expectedKey) {
      return res.status(500).send(
        '<p style="font-family:sans-serif;padding:24px">La récupération administrateur n’est pas configurée sur le serveur.</p>'
      );
    }

    if (!recoveryKey || recoveryKey !== expectedKey) {
      return res.status(403).send(
        formPage({ error: 'Clé de récupération incorrecte.' })
      );
    }

    if (!email || !password || !confirmPassword) {
      return res.status(400).send(
        formPage({ error: 'Tous les champs sont obligatoires.' })
      );
    }

    if (password.length < 8) {
      return res.status(400).send(
        formPage({
          error: 'Le nouveau mot de passe doit contenir au moins 8 caractères.'
        })
      );
    }

    if (password !== confirmPassword) {
      return res.status(400).send(
        formPage({
          error: 'Les deux mots de passe ne correspondent pas.'
        })
      );
    }

    const admin = await User.findOne({ role: 'admin' }).select('+passwordHash');

    if (!admin) {
      return res.status(404).send(
        formPage({ error: 'Aucun compte administrateur trouvé.' })
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const emailAlreadyUsed = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: admin._id }
    });

    if (emailAlreadyUsed) {
      return res.status(409).send(
        formPage({
          error: 'Cette adresse e-mail est déjà utilisée par un autre compte.'
        })
      );
    }

    admin.email = normalizedEmail;
    admin.passwordHash = await bcrypt.hash(password, 12);

    await admin.save();

    return res.send(`
      <!doctype html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Aegis A.G.I. — Compte récupéré</title>
        <style>
          body {
            font-family: system-ui, sans-serif;
            background: #0F172A;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0;
            padding: 20px;
          }

          .box {
            background: white;
            color: #0F172A;
            padding: 32px;
            border-radius: 14px;
            max-width: 400px;
            text-align: center;
          }

          .ok {
            color: #16A34A;
            font-size: 40px;
          }
        </style>
      </head>
      <body>
        <div class="box">
          <div class="ok">✓</div>
          <h1>Compte récupéré</h1>
          <p>
            Ton adresse e-mail et ton mot de passe ont été modifiés.
          </p>
          <p>
            Tu peux maintenant retourner sur la page de connexion
            et utiliser tes nouveaux identifiants.
          </p>
        </div>
      </body>
      </html>
    `);

  } catch (err) {
    next(err);
  }
}

module.exports = {
  showResetForm,
  resetAdmin
};
