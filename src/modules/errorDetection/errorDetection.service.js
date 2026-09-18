const { CPT_REGEX, ICD10_REGEX, REQUIRED_CLAIM_FIELDS } = require('./errorDetection.rules');

/**
 * Analyse un objet claim (avant sauvegarde définitive) et retourne
 * la liste des erreurs détectées, sans toucher à la base.
 */
function detectClaimErrors(claim) {
  const errors = [];

  for (const field of REQUIRED_CLAIM_FIELDS) {
    if (claim[field] === undefined || claim[field] === null || claim[field] === '') {
      errors.push({
        field,
        errorType: 'missing_field',
        severity: 'blocking',
        message: `Le champ "${field}" est requis`,
      });
    }
  }

  if (!claim.cptCodes || claim.cptCodes.length === 0) {
    errors.push({
      field: 'cptCodes',
      errorType: 'missing_field',
      severity: 'blocking',
      message: 'Au moins un code CPT est requis',
    });
  } else {
    claim.cptCodes.forEach((c, i) => {
      if (!CPT_REGEX.test(c.code)) {
        errors.push({
          field: `cptCodes[${i}]`,
          errorType: 'invalid_code',
          severity: 'blocking',
          message: `Code CPT invalide: "${c.code}" (5 chiffres attendus)`,
        });
      }
    });
  }

  if (!claim.icd10Codes || claim.icd10Codes.length === 0) {
    errors.push({
      field: 'icd10Codes',
      errorType: 'missing_field',
      severity: 'blocking',
      message: 'Au moins un code ICD-10 est requis',
    });
  } else {
    claim.icd10Codes.forEach((c, i) => {
      if (!ICD10_REGEX.test(c.code)) {
        errors.push({
          field: `icd10Codes[${i}]`,
          errorType: 'invalid_code',
          severity: 'warning',
          message: `Code ICD-10 au format inhabituel: "${c.code}"`,
        });
      }
    });
  }

  if (claim.billedAmount !== undefined && claim.billedAmount <= 0) {
    errors.push({
      field: 'billedAmount',
      errorType: 'format_error',
      severity: 'blocking',
      message: 'Le montant facturé doit être supérieur à 0',
    });
  }

  return errors;
}

module.exports = { detectClaimErrors };
