# AI Carbon Footprint Tracker

Tools to estimate and track the carbon footprint of your AI usage. Privacy-first: no content is ever read or sent anywhere — only string lengths and token counts.

**GitHub:** [github.com/n8finch/env-impact-tracker](https://github.com/n8finch/env-impact-tracker)

---

## What's included

| Tool | Status | Description |
|---|---|---|
| Claude Code Plugin | Live | `/env-impact` slash command — reads your real token logs |
| Web Calculator | Live | Static SPA for estimating CO2 by service, plan, and usage |
| Browser Extension | In progress | Tracks live token usage on claude.ai, chatgpt.com, gemini.google.com |

---

## Claude Code Plugin

Track your real token usage in Claude Code and get a monthly carbon estimate via a `/env-impact` slash command.

**How it works:** Reads `~/.claude/projects/**/*.jsonl` (Claude Code's local conversation logs), sums token counts for the current month, and converts them to a CO2 estimate. No content is ever read — only the `usage` block from each API response. Resets automatically on the 1st of each month.

### Privacy and efficiency

- **Privacy-first:** Only reads the `usage` block (token counts) from each log entry — message content, tool inputs, and all other fields are ignored.
- **Zero tokens consumed:** The script runs as a plain Python process outside of Claude. The `/env-impact` command costs one small API call to dispatch, but the calculation itself uses no tokens.
- **Fully local:** Pure Python stdlib (`json`, `datetime`, `pathlib`). No network calls, no dependencies, nothing leaves your machine.

### Install

One command, no repo clone needed:

```bash
curl -fsSL https://raw.githubusercontent.com/n8finch/env-impact-tracker/main/claude-plugin/install.sh | bash
```

This downloads `track.py` into `~/.claude/plugins/env-impact/` and `env-impact.md` into `~/.claude/commands/`. Requires Python 3 (no other dependencies).

To uninstall:

```bash
rm ~/.claude/plugins/env-impact/track.py
rm ~/.claude/commands/env-impact.md
```

### Usage

Type `/env-impact` in any Claude Code session:

```
AI Carbon Footprint — March 2026
============================================

  Token usage this month:
    Input:                290,095
    Output:             2,302,139
    Cache (created):   35,653,324
    Cache (reads):    495,890,263
    API calls:              7,780
    Total raw:        534,135,821

  Estimated carbon impact:
    26.3504 kg CO2e
    ~ 65.9 miles driven
    ~ 1757 kettles boiled
    ~ 3294 smartphone charges

  Methodology: Claude coding baseline (400g CO2e/1K queries,
  1.5x coding multiplier). Cache reads weighted at 10%.
  Resets automatically on the 1st of each month.
```

### Carbon methodology

- Baseline: 400g CO2e per 1,000 standard Claude queries (2026 benchmark)
- Coding-heavy multiplier: 1.5x (Claude Code sessions are all coding)
- Effective rate: 0.3g CO2e per 1,000 tokens
- Cache reads weighted at 10% (significantly less compute than fresh tokens)

---

## Web Calculator

Live at: **[env-impact-tracker.netlify.app](https://env-impact-tracker.netlify.app)** *(update once deployed)*

A static single-page app for estimating your monthly AI carbon footprint. No backend, no tracking — all calculations run locally in your browser.

### Features

- Service selector: Claude, ChatGPT, Gemini, GitHub Copilot, Perplexity
- Plan selector per service (Claude Pro / Max 5x / Max 20x, ChatGPT Plus / Pro, etc.)
- Usage slider (0-100% of a Pro plan's ~1,000 monthly queries)
- Token mode: paste your raw token count from `/env-impact` directly for an exact estimate
- Usage multipliers: Reasoning Mode (x20), Long Threads (x3), Coding Heavy (x1.5)
- Quick-start presets: Web Developer, Casual Search, ChatGPT Researcher, Data Science
- Impact dashboard: kg CO2e, miles driven, kettles boiled, smartphone charges
- Methodology explanation and primary source links
- Offset and removal provider links (Climeworks, Gold Standard, Tradewater, SeaTrees, Ecologi)
- Civic action section: contact your representative by country (21 countries; open a PR to add yours)

### Stack

Vite + React + TypeScript + Tailwind CSS v4, deployed to Netlify.

### Local development

```bash
cd web-app
npm install
npm run dev
```

### Netlify build settings

| Setting | Value |
|---|---|
| Base directory | `web-app` |
| Build command | `npm run build` |
| Publish directory | `web-app/dist` |

### Environment variables

| Variable | Purpose |
|---|---|
| `VITE_POSTHOG_KEY` | PostHog analytics key (optional — analytics disabled if unset) |

See `web-app/.env.example` for reference.

### Carbon methodology

- Baseline emissions per 1,000 queries: Claude 400g, ChatGPT 250g, Perplexity 300g, Copilot 150g, Gemini 30g CO2e
- Multipliers stack multiplicatively: Reasoning Mode x20, Long Threads x3, Coding Heavy x1.5
- Token mode: applies a 16.4% effective-weight ratio to account for cache reads (cache reads = ~10% compute of fresh tokens)
- Equivalences: 400g CO2e per mile driven, 15g per kettle boiled, 8g per smartphone charge

---

## Browser Extension

Tracks live token usage on `claude.ai`, `chatgpt.com`, and `gemini.google.com`. Shows a monthly carbon estimate in the extension popup. Type `/env-impact` in any chat input to get an inline carbon report without sending a message.

**Privacy:** only message character counts are tracked — never content. All data is stored locally in `chrome.storage.local`.

### Install (development / unpacked)

1. Open `chrome://extensions` (or `edge://extensions`)
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `browser-extension/` directory

See `browser-extension/DEV.md` for full development instructions.

### Architecture

| File | Role |
|---|---|
| `manifest.json` | MV3 manifest, host permissions for 3 sites |
| `content.js` | MutationObserver per site, token estimation, `/env-impact` intercept |
| `background.js` | Service worker, monthly storage, carbon calculation |
| `popup.html/js/css` | Extension popup dashboard |

### Carbon methodology

- Token estimate: `character_count / 4` (standard heuristic, no access to official tokenizers)
- Site baselines: Claude 0.6g/1K tokens (includes 1.5x coding), ChatGPT 0.25g/1K, Gemini 0.03g/1K
- Reasoning mode detected via DOM selectors: output tokens weighted at 20x

---

## Project structure

```
claude-plugin/      # Phase 1: Claude Code /env-impact slash command
web-app/            # Phase 2: React calculator (Vite + Tailwind v4)
browser-extension/  # Phase 3: Chrome/Edge MV3 extension
```

---

## Contributing

PRs welcome, especially for:
- Updated DOM selectors in `browser-extension/content.js` when chat UIs change
- Additional countries in `web-app/src/components/CivicAction.tsx`
- Emissions data corrections with sources in `web-app/src/lib/emissions-data.ts`
