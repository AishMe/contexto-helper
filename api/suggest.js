// api/suggest.js
// Vercel Serverless Function — runs on the server, never exposed to the browser.
// This proxy pattern keeps the OPENROUTER_API_KEY secret.
//
// Request  (POST): { guesses: Array<{ word: string, rank: number }> }
// Response (200):  { suggestions: string[], strategy: string }
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Manually load .env.local in development
try {
  const env = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
  env.split('\n').forEach(line => {
    const [key, val] = line.split('=');
    if (key && val) process.env[key.trim()] = val.trim();
  });
} catch {}

export default async function handler(req, res) {
  // ── Only allow POST ────────────────────────────────────────────────────
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { guesses } = req.body;

  // ── Basic input validation ─────────────────────────────────────────────
  if (!Array.isArray(guesses) || guesses.length === 0) {
    return res.status(400).json({ error: 'guesses array is required' });
  }

  // ── Build the prompt ───────────────────────────────────────────────────
  // Sort guesses best-first so the LLM sees the most useful context first
  const sorted = [...guesses].sort((a, b) => a.rank - b.rank);

  const guessList = sorted
    .map(g => `  "${g.word}" → rank #${g.rank}`)
    .join('\n');

  const prompt = `You are helping solve Contexto, a word similarity game where guesses are ranked by semantic closeness to a secret word. Rank #1 means the guess IS the secret word.

    The player's guesses ranked best to worst:
    ${sorted.map(g => `${g.word}: #${g.rank}`).join(', ')}

    Analyse the semantic pattern and suggest 5 real English words the player should try next. Pick words that are semantically close to the best-ranked guesses.

    Respond with ONLY a JSON object in this format (no markdown, no explanation):
    {"suggestions":["REAL_WORD_1","REAL_WORD_2","REAL_WORD_3","REAL_WORD_4","REAL_WORD_5"],"strategy":"SHORT_TIP"}`;

  // ── Call OpenRouter ────────────────────────────────────────────────────
  try {
    // Abort the request if it takes longer than 30 seconds
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      signal: controller.signal,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type':  'application/json',
        // OpenRouter recommends these headers for attribution
        'HTTP-Referer':  'https://contexto-helper.vercel.app',
        'X-Title':       'Contexto Helper',
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.5,  // lower = more focused, less likely to return empty
        }),
    });
    clearTimeout(timeout);

    if (!openRouterRes.ok) {
      const errText = await openRouterRes.text();
      console.error('OpenRouter error:', errText);
      return res.status(502).json({ error: 'AI service error. Try again.' });
    }

    const data = await openRouterRes.json();
    // Some free models (reasoning models) put output in reasoning instead of content
    const message = data.choices?.[0]?.message;
    const raw = message?.content || message?.reasoning || '';

    // ── Parse the JSON the LLM returned ─────────────────────────────────
    // Strip any accidental markdown fences before parsing
    // Extract JSON from the response — the model sometimes wraps it in text
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        console.error('No JSON found in model response:', raw);
        return res.status(502).json({ error: 'AI returned an unexpected response. Try again.' });
    }

    const clean  = jsonMatch[0];
    const parsed = JSON.parse(clean);

    return res.status(200).json({
      suggestions: parsed.suggestions || [],
      strategy:    parsed.strategy    || '',
    });

  } catch (err) {
    console.error('suggest handler error:', err);

    // Give the user a friendly timeout message instead of a generic 500
    if (err.name === 'AbortError' || err.code === 'UND_ERR_HEADERS_TIMEOUT') {
        return res.status(504).json({ error: 'AI took too long. Try again — free models can be slow.' });
    }

    return res.status(500).json({ error: 'Internal server error.' });
  }
}