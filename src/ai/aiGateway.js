/**
 * Point d'entrée unique pour tout appel au modèle Claude (Anthropic).
 * Centraliser ici permet d'appliquer une politique cohérente :
 * - anonymisation/minimisation des données patient avant envoi
 * - gestion des erreurs et retries
 * - traçabilité des appels IA (utile pour l'audit)
 *
 * Non branché tant que le module "appeals" n'est pas activé (phase 2).
 */
async function askClaude({ systemPrompt, userPrompt, maxTokens = 1000 }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const err = new Error('ANTHROPIC_API_KEY manquant — module IA non configuré');
    err.status = 500;
    throw err;
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    const err = new Error(`Erreur API Claude: ${errText}`);
    err.status = 502;
    throw err;
  }

  const data = await response.json();
  return data.content.map((block) => block.text || '').join('\n');
}

module.exports = { askClaude };
