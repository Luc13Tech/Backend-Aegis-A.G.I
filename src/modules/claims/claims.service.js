const Claim = require('../../models/Claim');
const ClaimError = require('../../models/ClaimError');
const { detectClaimErrors } = require('../errorDetection/errorDetection.service');
const { generateClaimPayload } = require('./claims.generator');

async function createClaim(data) {
  const errors = detectClaimErrors(data);

  const claim = await Claim.create({
    ...data,
    status: errors.some((e) => e.severity === 'blocking') ? 'draft' : 'ready',
  });

  if (errors.length > 0) {
    await ClaimError.insertMany(errors.map((e) => ({ ...e, claim: claim._id })));
  }

  return { claim, errors };
}

async function revalidateClaim(claimId) {
  const claim = await Claim.findById(claimId);
  if (!claim) {
    const err = new Error('Claim introuvable');
    err.status = 404;
    throw err;
  }

  await ClaimError.deleteMany({ claim: claim._id, resolved: false });
  const errors = detectClaimErrors(claim.toObject());

  if (errors.length > 0) {
    await ClaimError.insertMany(errors.map((e) => ({ ...e, claim: claim._id })));
    claim.status = errors.some((e) => e.severity === 'blocking') ? 'draft' : 'ready';
  } else {
    claim.status = 'ready';
  }
  await claim.save();

  return { claim, errors };
}

async function submitClaim(claimId) {
  const claim = await Claim.findById(claimId);
  if (!claim) {
    const err = new Error('Claim introuvable');
    err.status = 404;
    throw err;
  }
  if (claim.status !== 'ready') {
    const err = new Error('Le claim doit être au statut "ready" avant soumission');
    err.status = 400;
    throw err;
  }

  const payload = generateClaimPayload(claim);
  // TODO phase intégration réelle : envoi au clearinghouse ici
  claim.status = 'submitted';
  claim.submittedAt = new Date();
  await claim.save();

  return { claim, payload };
}

async function getClaimWithErrors(claimId) {
  const claim = await Claim.findById(claimId);
  const errors = await ClaimError.find({ claim: claimId, resolved: false });
  return { claim, errors };
}

module.exports = { createClaim, revalidateClaim, submitClaim, getClaimWithErrors };
