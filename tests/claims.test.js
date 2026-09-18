const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { detectClaimErrors } = require('../src/modules/errorDetection/errorDetection.service');
const { createClaim, submitClaim } = require('../src/modules/claims/claims.service');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Promise.all(
    Object.values(mongoose.connection.collections).map((c) => c.deleteMany({}))
  );
});

const baseClaim = () => ({
  patient: new mongoose.Types.ObjectId(),
  provider: new mongoose.Types.ObjectId(),
  clinic: new mongoose.Types.ObjectId(),
  policy: new mongoose.Types.ObjectId(),
  format: 'CMS-1500',
  dateOfService: new Date(),
  billedAmount: 150,
  cptCodes: [{ code: '99213' }],
  icd10Codes: [{ code: 'J06.9' }],
});

describe('errorDetection.service', () => {
  it('ne remonte aucune erreur sur un claim valide', () => {
    const errors = detectClaimErrors(baseClaim());
    expect(errors).toHaveLength(0);
  });

  it('détecte un champ requis manquant', () => {
    const claim = baseClaim();
    delete claim.billedAmount;
    const errors = detectClaimErrors(claim);
    expect(errors.some((e) => e.field === 'billedAmount')).toBe(true);
  });

  it('détecte un code CPT invalide', () => {
    const claim = baseClaim();
    claim.cptCodes = [{ code: 'ABC' }];
    const errors = detectClaimErrors(claim);
    expect(errors.some((e) => e.errorType === 'invalid_code')).toBe(true);
  });
});

describe('claims.service', () => {
  it('crée un claim en statut "ready" quand il n\'y a pas d\'erreur bloquante', async () => {
    const { claim, errors } = await createClaim(baseClaim());
    expect(claim.status).toBe('ready');
    expect(errors).toHaveLength(0);
  });

  it('crée un claim en statut "draft" quand il manque des données', async () => {
    const claim = baseClaim();
    delete claim.cptCodes;
    const { claim: created, errors } = await createClaim(claim);
    expect(created.status).toBe('draft');
    expect(errors.length).toBeGreaterThan(0);
  });

  it('refuse de soumettre un claim qui n\'est pas "ready"', async () => {
    const claim = baseClaim();
    delete claim.icd10Codes;
    const { claim: created } = await createClaim(claim);
    await expect(submitClaim(created._id)).rejects.toThrow(
      'Le claim doit être au statut "ready" avant soumission'
    );
  });
});
