/**
 * Transforme un document Claim Mongo en structure prête pour le format cible.
 * Implémentation simplifiée (structure de données) — le vrai encodage X12 837
 * EDI ou le rendu PDF CMS-1500/UB-04 sera branché ici une fois le format
 * validé avec un premier clearinghouse partenaire.
 */
function generateClaimPayload(claim) {
  const base = {
    claimId: claim._id?.toString(),
    dateOfService: claim.dateOfService,
    billedAmount: claim.billedAmount,
    diagnosisCodes: claim.icd10Codes.map((c) => c.code),
    procedureCodes: claim.cptCodes.map((c) => ({ code: c.code, units: c.units })),
  };

  switch (claim.format) {
    case 'CMS-1500':
      return { formType: 'CMS-1500', ...base, placeOfService: '11' };
    case 'UB-04':
      return { formType: 'UB-04', ...base, revenueCode: '0450' };
    case 'X12-837':
      return { formType: 'X12-837', ...base, transactionSet: '837P' };
    default: {
      const err = new Error(`Format de claim non supporté: ${claim.format}`);
      err.status = 400;
      throw err;
    }
  }
}

module.exports = { generateClaimPayload };
