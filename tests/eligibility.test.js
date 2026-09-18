const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const InsurancePolicy = require('../src/models/InsurancePolicy');
const Patient = require('../src/models/Patient');
const Clinic = require('../src/models/Clinic');
const { runEligibilityCheck } = require('../src/modules/eligibility/eligibility.service');

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

describe('eligibility.service', () => {
  it('crée un EligibilityCheck avec un statut valide', async () => {
    const clinic = await Clinic.create({ name: 'Test Clinic', npi: '1234567890' });
    const patient = await Patient.create({
      clinic: clinic._id,
      firstName: 'John',
      lastName: 'Doe',
      dob: new Date('1990-01-01'),
    });
    const policy = await InsurancePolicy.create({
      patient: patient._id,
      payerName: 'Test Payer',
      payerId: 'PAYER123',
      memberId: 'MEM456',
    });

    const result = await runEligibilityCheck({
      patientId: patient._id,
      policyId: policy._id,
      requestedBy: new mongoose.Types.ObjectId(),
    });

    expect(result).toBeTruthy();
    expect(['covered', 'not_covered', 'partial']).toContain(result.status);
    expect(result.patient.toString()).toBe(patient._id.toString());
  });

  it('lève une erreur 404 si la police est introuvable', async () => {
    await expect(
      runEligibilityCheck({
        patientId: new mongoose.Types.ObjectId(),
        policyId: new mongoose.Types.ObjectId(),
        requestedBy: new mongoose.Types.ObjectId(),
      })
    ).rejects.toThrow('Police d\'assurance introuvable');
  });
});
