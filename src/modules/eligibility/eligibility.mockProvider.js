/**
 * Simule une réponse de clearinghouse/assureur (ex: Availity, Change Healthcare).
 * À remplacer par une vraie intégration une fois les contrats commerciaux signés.
 */
async function checkEligibilityMock(policy) {
  // Simule une latence réseau réaliste
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Logique déterministe simple basée sur le payerId pour des tests reproductibles
  const seed = (policy.payerId || '').length + (policy.memberId || '').length;

  if (seed % 5 === 0) {
    return {
      status: 'not_covered',
      notes: 'Police expirée ou inactive selon le payeur (simulation)',
      rawResponse: { source: 'mock', payerId: policy.payerId, result: 'INACTIVE' },
    };
  }

  if (seed % 3 === 0) {
    return {
      status: 'partial',
      copay: 40,
      coinsurance: 20,
      deductibleRemaining: 500,
      outOfPocketMax: 6000,
      notes: 'Couverture partielle — franchise non atteinte (simulation)',
      rawResponse: { source: 'mock', payerId: policy.payerId, result: 'PARTIAL' },
    };
  }

  return {
    status: 'covered',
    copay: 25,
    coinsurance: 10,
    deductibleRemaining: 0,
    outOfPocketMax: 6000,
    notes: 'Couverture active (simulation)',
    rawResponse: { source: 'mock', payerId: policy.payerId, result: 'ACTIVE' },
  };
}

module.exports = { checkEligibilityMock };
