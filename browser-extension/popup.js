// EcoAI Popup Script
// Fetches current state from background.js and renders the dashboard.

const SITE_META = {
  'claude.ai':         { name: 'Claude',    dot: '#7c3aed', gramsPerToken: 0.0006  },
  'chatgpt.com':       { name: 'ChatGPT',   dot: '#10a37f', gramsPerToken: 0.00025 },
  'gemini.google.com': { name: 'Gemini',    dot: '#4285f4', gramsPerToken: 0.00003 },
};

function fmt(n, decimals = 4) {
  return Number(n).toFixed(decimals);
}

function fmtTokens(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function render({ state, carbon }) {
  // Header month
  document.getElementById('month').textContent = state.month ?? '—';

  // Hero
  document.getElementById('kg').textContent = fmt(carbon.kg, 4);

  // Equivalences
  document.getElementById('miles').textContent = fmt(carbon.miles, 1);
  document.getElementById('kettles').textContent = Math.round(carbon.kettles);
  document.getElementById('smartphones').textContent = Math.round(carbon.smartphones);

  // Totals
  document.getElementById('queries').textContent = `${carbon.totalQueries} queries`;
  document.getElementById('tokens').textContent = `${fmtTokens(carbon.totalTokens)} tokens est.`;

  // Per-site rows
  const container = document.getElementById('sites');
  container.innerHTML = '';

  for (const [siteId, meta] of Object.entries(SITE_META)) {
    const data = state.sites?.[siteId];
    if (!data) continue;

    const tokens = (data.inputTokens ?? 0) + (data.outputTokens ?? 0);
    const kg = (tokens * meta.gramsPerToken) / 1000;

    const row = document.createElement('div');
    row.className = 'site-row';
    row.innerHTML = `
      <span class="site-dot" style="background:${meta.dot}"></span>
      <span class="site-name">${meta.name}</span>
      <span class="site-queries">${data.queries ?? 0} q</span>
      <span class="site-kg">${fmt(kg, 4)} kg</span>
    `;
    container.appendChild(row);
  }

  // Show "no data yet" if everything is zero
  if (carbon.totalQueries === 0) {
    const empty = document.createElement('div');
    empty.style.cssText = 'padding:12px 16px; color: var(--ink-dim); font-size:11px;';
    empty.textContent = 'No activity tracked yet this month.';
    container.appendChild(empty);
  }
}

// Load data on open
chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
  if (response) render(response);
});

// Reset button
document.getElementById('reset-btn').addEventListener('click', () => {
  if (!confirm('Reset all tracked data for this month?')) return;
  chrome.runtime.sendMessage({ type: 'RESET' }, () => {
    chrome.runtime.sendMessage({ type: 'GET_STATE' }, (response) => {
      if (response) render(response);
    });
  });
});
