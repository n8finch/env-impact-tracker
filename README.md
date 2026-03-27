# AI Carbon Footprint Tracker

Tools to estimate and track the carbon footprint of your AI usage — starting with a Claude Code plugin that reads your actual token logs, with a web calculator and browser extension on the way.

---

## Claude Code Plugin

Track your real token usage in Claude Code and get a monthly carbon estimate via a `/env-impact` slash command.

**How it works:** Reads `~/.claude/projects/**/*.jsonl` (Claude Code's local conversation logs), sums token counts for the current month, and converts them to a CO₂ estimate. No content is ever read — only the `usage` block from each API response. Resets automatically on the 1st of each month.

### Privacy & efficiency

- **Privacy-first:** Only reads the `usage` block (token counts) from each log entry — message content, tool inputs, and all other fields are ignored.
- **Zero tokens consumed:** The script runs as a plain Python process outside of Claude. The `/env-impact` command costs one small API call to dispatch, but the calculation itself uses no tokens.
- **Fully local:** Pure Python stdlib (`json`, `datetime`, `pathlib`). No network calls, no dependencies, nothing leaves your machine.

### Install

```bash
git clone https://github.com/n8finch/env-impact-tracker
cd env-impact-tracker
bash claude-plugin/install.sh
```

This symlinks `track.py` into `~/.claude/plugins/env-impact/` and `env-impact.md` into `~/.claude/commands/`. Requires Python 3 (no dependencies).

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

- Baseline: 400g CO₂e per 1,000 standard Claude queries (2026 benchmark)
- Coding-heavy multiplier: 1.5× (Claude Code sessions are all coding)
- Effective rate: 0.3g CO₂e per 1,000 tokens
- Cache reads weighted at 10% (significantly less compute than fresh tokens)

---

## Web Calculator

Live at: **[env-impact-tracker.netlify.app](https://env-impact-tracker.netlify.app)** *(update once deployed)*

A static single-page app for estimating your monthly AI carbon footprint. No backend, no tracking — all calculations run locally in your browser.

**Features:**

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

## Browser Extension *(coming soon)*

A Chrome/Edge extension that monitors token usage live on `claude.ai`, `chatgpt.com`, and `gemini.google.com`. Intercepts a `/env-impact` command typed in any chat to show a carbon report without sending a message. Zero content read — tracks only message length.

---

## Project structure

```
claude-plugin/      # Phase 1: Claude Code /env-impact command
web-app/            # Phase 2: React calculator (live on Netlify)
browser-extension/  # Phase 3: Chrome/Edge extension (coming soon)
```
