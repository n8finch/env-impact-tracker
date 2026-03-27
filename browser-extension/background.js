// EcoAI Background Service Worker
// Receives token events from content.js, persists monthly totals to chrome.storage.local.
// Privacy: only token counts (derived from string length) are stored — never content.

// Grams CO2e per 1,000 queries, per site (2026 benchmarks)
const BASELINES = {
  'claude.ai':           400, // × 1.5 coding multiplier baked in below
  'chatgpt.com':         250,
  'gemini.google.com':    30,
};

// Effective grams per estimated token (baseline / 1000 tokens-per-query)
// Claude gets the 1.5× coding multiplier since most claude.ai usage is agentic/coding.
const GRAMS_PER_TOKEN = {
  'claude.ai':          (400 * 1.5) / 1_000_000, // 0.0006 g/token
  'chatgpt.com':         250        / 1_000_000, // 0.00025 g/token
  'gemini.google.com':    30        / 1_000_000, // 0.00003 g/token
};

const CURRENT_MONTH = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const DEFAULT_SITE = () => ({ inputTokens: 0, outputTokens: 0, queries: 0 });

const DEFAULT_STATE = () => ({
  month: CURRENT_MONTH(),
  sites: {
    'claude.ai':           DEFAULT_SITE(),
    'chatgpt.com':         DEFAULT_SITE(),
    'gemini.google.com':   DEFAULT_SITE(),
  },
});

// Load state, resetting if the month has rolled over.
async function loadState() {
  const { ecoai } = await chrome.storage.local.get('ecoai');
  if (!ecoai || ecoai.month !== CURRENT_MONTH()) {
    const fresh = DEFAULT_STATE();
    await chrome.storage.local.set({ ecoai: fresh });
    return fresh;
  }
  return ecoai;
}

async function saveState(state) {
  await chrome.storage.local.set({ ecoai: state });
}

// Calculate total carbon across all sites.
function calcCarbon(state) {
  let totalGrams = 0;
  let totalTokens = 0;
  let totalQueries = 0;

  for (const [site, data] of Object.entries(state.sites)) {
    const tokens = data.inputTokens + data.outputTokens;
    const rate = GRAMS_PER_TOKEN[site] ?? GRAMS_PER_TOKEN['chatgpt.com'];
    totalGrams += tokens * rate;
    totalTokens += tokens;
    totalQueries += data.queries;
  }

  return {
    grams: totalGrams,
    kg: totalGrams / 1000,
    miles: totalGrams / 400,
    kettles: totalGrams / 15,
    smartphones: totalGrams / 8,
    totalTokens,
    totalQueries,
  };
}

// Handle messages from content.js
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'TOKEN_EVENT') {
    (async () => {
      const state = await loadState();
      const site = state.sites[msg.site] ?? DEFAULT_SITE();

      if (msg.role === 'user') {
        site.inputTokens += msg.tokens;
        site.queries += 1;
      } else if (msg.role === 'assistant') {
        // Reasoning mode: output tokens cost ~20× more compute
        site.outputTokens += msg.tokens * (msg.isReasoning ? 20 : 1);
      }

      state.sites[msg.site] = site;
      await saveState(state);
      sendResponse({ ok: true });
    })();
    return true; // keep message channel open for async response
  }

  if (msg.type === 'GET_STATE') {
    (async () => {
      const state = await loadState();
      const carbon = calcCarbon(state);
      sendResponse({ state, carbon });
    })();
    return true;
  }

  if (msg.type === 'RESET') {
    (async () => {
      const fresh = DEFAULT_STATE();
      await saveState(fresh);
      sendResponse({ ok: true });
    })();
    return true;
  }
});
