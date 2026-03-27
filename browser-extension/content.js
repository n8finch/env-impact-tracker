// EcoAI Content Script
// Runs on claude.ai, chatgpt.com, gemini.google.com.
// Watches for new messages via MutationObserver, estimates tokens from string length,
// and intercepts the /env-impact command to show a carbon report inline.
//
// Privacy: only the CHARACTER COUNT of messages is used — content is never read or stored.

const SITE = location.hostname; // e.g. 'claude.ai'

// ---------------------------------------------------------------------------
// Site-specific selectors
// These are best-effort approximations. AI chat UIs update frequently —
// if a selector stops working, open a PR with the updated one.
// ---------------------------------------------------------------------------
const SELECTORS = {
  'claude.ai': {
    // Input: ProseMirror contenteditable
    input: '[contenteditable="true"].ProseMirror, [contenteditable="true"][data-placeholder]',
    // Completed user turn
    userMessage: '[data-testid="human-turn-content"], .human-turn .whitespace-pre-wrap',
    // Completed assistant turn
    aiMessage: '[data-testid="assistant-message"] .prose, .ai-message .prose',
    // Thinking / extended reasoning indicator
    reasoning: '.claude-thinking-state, [data-thinking="true"], .thinking-indicator',
  },
  'chatgpt.com': {
    input: '#prompt-textarea',
    userMessage: '[data-message-author-role="user"] .whitespace-pre-wrap',
    aiMessage: '[data-message-author-role="assistant"] .markdown',
    reasoning: '.gpt-thought-container, [data-thinking]',
  },
  'gemini.google.com': {
    input: '.ql-editor[contenteditable="true"], rich-textarea [contenteditable="true"]',
    userMessage: '.user-query .query-text, .user-query-container p',
    aiMessage: '.response-content .markdown, model-response .response-text',
    reasoning: '.thinking-process, .extended-thinking',
  },
};

const sel = SELECTORS[SITE];
if (!sel) {
  // Not a tracked site — do nothing
  throw new Error(`EcoAI: no config for ${SITE}`);
}

// ---------------------------------------------------------------------------
// Token estimation
// ---------------------------------------------------------------------------
function estimateTokens(text) {
  // OpenAI's rough rule of thumb: ~4 chars per token
  return Math.ceil(text.length / 4);
}

// ---------------------------------------------------------------------------
// Message deduplication
// We track element references we've already counted to avoid double-counting
// when MutationObserver fires multiple times on the same element.
// ---------------------------------------------------------------------------
const counted = new WeakSet();

function sendTokenEvent(role, tokens, isReasoning = false) {
  if (tokens <= 0) return;
  chrome.runtime.sendMessage({
    type: 'TOKEN_EVENT',
    site: SITE,
    role,       // 'user' | 'assistant'
    tokens,
    isReasoning,
  });
}

function processUserMessages() {
  document.querySelectorAll(sel.userMessage).forEach((el) => {
    if (counted.has(el)) return;
    counted.add(el);
    sendTokenEvent('user', estimateTokens(el.innerText ?? el.textContent ?? ''));
  });
}

function processAiMessages() {
  const isReasoning = !!document.querySelector(sel.reasoning);
  document.querySelectorAll(sel.aiMessage).forEach((el) => {
    if (counted.has(el)) return;
    // Only count elements that appear "complete" (not still streaming).
    // Heuristic: skip if a sibling/ancestor has a streaming cursor class.
    const isStreaming =
      el.closest('[data-is-streaming="true"]') ||
      el.closest('.result-streaming') ||
      el.classList.contains('streaming');
    if (isStreaming) return;
    counted.add(el);
    sendTokenEvent('assistant', estimateTokens(el.innerText ?? el.textContent ?? ''), isReasoning);
  });
}

// ---------------------------------------------------------------------------
// /env-impact command interception
// When the user types /env-impact in the chat input and presses Enter,
// we prevent the message from being sent and show a carbon report instead.
// ---------------------------------------------------------------------------
function showCarbonReport() {
  chrome.runtime.sendMessage({ type: 'GET_STATE' }, ({ state, carbon }) => {
    const month = state?.month ?? '—';
    const kg = (carbon?.kg ?? 0).toFixed(4);
    const miles = (carbon?.miles ?? 0).toFixed(1);
    const kettles = Math.round(carbon?.kettles ?? 0);
    const queries = carbon?.totalQueries ?? 0;

    const lines = [
      `EcoAI Carbon Report — ${month}`,
      `═══════════════════════════════`,
      `  Tracked queries:   ${queries}`,
      `  Estimated CO₂e:    ${kg} kg`,
      `  ≈ ${miles} miles driven`,
      `  ≈ ${kettles} kettles boiled`,
      ``,
      `  (estimates based on character counts × site baselines)`,
      `  Full calculator: https://n8finch.com/ecoai`,
    ].join('\n');

    // Inject a temporary overlay into the page
    const existing = document.getElementById('ecoai-report');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ecoai-report';
    overlay.style.cssText = `
      position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
      background: #0f1a14; border: 1px solid #10b981; border-radius: 12px;
      padding: 20px 24px; font-family: monospace; font-size: 13px; line-height: 1.7;
      color: #a3e4c7; white-space: pre; z-index: 99999; max-width: 480px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    `;
    overlay.textContent = lines;

    const close = document.createElement('button');
    close.textContent = '× close';
    close.style.cssText = `
      display: block; margin-top: 12px; background: none; border: 1px solid #10b981;
      color: #10b981; border-radius: 6px; padding: 4px 12px; cursor: pointer;
      font-family: monospace; font-size: 12px;
    `;
    close.onclick = () => overlay.remove();
    overlay.appendChild(close);
    document.body.appendChild(overlay);

    // Auto-dismiss after 15 seconds
    setTimeout(() => overlay?.remove(), 15_000);
  });
}

function attachInputListener() {
  const input = document.querySelector(sel.input);
  if (!input) return;

  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    const text = (input.value ?? input.innerText ?? input.textContent ?? '').trim();
    if (text === '/env-impact') {
      e.preventDefault();
      e.stopImmediatePropagation();
      // Clear the input
      if (input.value !== undefined) input.value = '';
      else input.innerText = '';
      showCarbonReport();
    }
  }, true);
}

// ---------------------------------------------------------------------------
// MutationObserver — watches the whole document for new message elements
// ---------------------------------------------------------------------------
let inputListenerAttached = false;

const observer = new MutationObserver(() => {
  processUserMessages();
  processAiMessages();

  // Attach input listener once the input field exists
  if (!inputListenerAttached && document.querySelector(sel.input)) {
    attachInputListener();
    inputListenerAttached = true;
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// Initial pass in case messages are already in the DOM
processUserMessages();
processAiMessages();
attachInputListener();
