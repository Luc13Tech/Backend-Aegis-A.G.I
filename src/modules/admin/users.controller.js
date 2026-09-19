const bcrypt = require('bcryptjs');
const User = require('../../models/User');

async function list(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { name, email, password, role, clinic } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email et password requis' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Cet email est déjà utilisé' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role === 'admin' ? 'admin' : 'staff',
      clinic,
    });

    res.locals.userId = user._id;
    const { passwordHash: _omit, ...safeUser } = user.toObject();
    res.status(201).json(safeUser);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { role, active } = req.body;
    const updates = {};
    if (role) updates.role = role;
    if (active !== undefined) updates.active = active;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    res.json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update };
