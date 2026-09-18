const {
  createClaim,
  revalidateClaim,
  submitClaim,
  getClaimWithErrors,
} = require('./claims.service');

async function create(req, res, next) {
  try {
    const { claim, errors } = await createClaim(req.body);
    res.status(201).json({ claim, errors });
  } catch (err) {
    next(err);
  }
}

async function revalidate(req, res, next) {
  try {
    const { claim, errors } = await revalidateClaim(req.params.id);
    res.json({ claim, errors });
  } catch (err) {
    next(err);
  }
}

async function submit(req, res, next) {
  try {
    const { claim, payload } = await submitClaim(req.params.id);
    res.json({ claim, payload });
  } catch (err) {
    next(err);
  }
}

async function get(req, res, next) {
  try {
    const result = await getClaimWithErrors(req.params.id);
    if (!result.claim) return res.status(404).json({ error: 'Claim introuvable' });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { create, revalidate, submit, get };
