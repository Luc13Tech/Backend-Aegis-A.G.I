// Formats réels simplifiés — à enrichir avec une vraie table de référence CMS
const CPT_REGEX = /^\d{5}$/; // 5 chiffres
const ICD10_REGEX = /^[A-TV-Z][0-9][A-Z0-9](\.[A-Z0-9]{1,4})?$/i;

const REQUIRED_CLAIM_FIELDS = [
  'patient', 'provider', 'clinic', 'policy', 'format', 'dateOfService', 'billedAmount',
];

module.exports = { CPT_REGEX, ICD10_REGEX, REQUIRED_CLAIM_FIELDS };
