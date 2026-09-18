/**
 * Filtre les champs sensibles avant tout log applicatif (console, morgan custom).
 * À utiliser partout où une requête/réponse pourrait être loggée.
 */
const SENSITIVE_KEYS = [
  'ssn', 'ssnLast4', 'dob', 'password', 'passwordHash',
  'memberId', 'taxId', 'diagnosis', 'icd10Codes',
];

function redact(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(redact);

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.includes(key)) {
      clean[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = redact(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

// Middleware morgan-compatible : remplace le body des requêtes avant logging
function sanitizeLogs(req, res, next) {
  req.sanitizedBody = redact(req.body);
  next();
}

module.exports = { sanitizeLogs, redact };
