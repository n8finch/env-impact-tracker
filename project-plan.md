# Project Plan: AI Carbon Footprint Tracker

**GitHub:** https://github.com/n8finch/env-impact-tracker
**Domain:** myenvtracker.com (to be purchased)
**Netlify:** to be deployed (update URL once live)

---

## Goals and Scope

Build tools to estimate and track the carbon footprint of AI usage across three phases:

1. Claude Code plugin — local token tracking via `/env-impact` command
2. Web app — static single-page calculator, deployed to Netlify
3. Browser extension — live tracking on claude.ai, chatgpt.com, gemini.google.com

---

## Phase 1: Claude Code Plugin - COMPLETE

`/env-impact` slash command for Claude Code. Reads real token counts from local JSONL logs and converts to a monthly carbon estimate.

**Install (one-liner, no clone needed):**
```bash
curl -fsSL https://raw.githubusercontent.com/n8finch/env-impact-tracker/main/claude-plugin/install.sh | bash
```

**Files:**
- `claude-plugin/track.py` — scanner script (downloaded to `~/.claude/plugins/env-impact/`)
- `claude-plugin/env-impact.md` — slash command definition (downloaded to `~/.claude/commands/`)
- `claude-plugin/install.sh` — standalone downloader/installer

**Features:**
- Reads `~/.claude/projects/**/*.jsonl`, sums token counts for current month only
- Cache reads weighted at 10% compute vs fresh tokens
- Outputs kg CO2e, miles driven, kettles boiled, smartphone charges
- Resets automatically on the 1st (filter-based, no cron)
- Privacy-first: only token counts read, never content

---

## Phase 2: Web Calculator - COMPLETE (pending deploy)

Static SPA at `web-app/`. Built with Vite + React + TypeScript + Tailwind CSS v4.

**Netlify build settings:**
- Base directory: `web-app`
- Build command: `npm run build`
- Publish directory: `web-app/dist`
- Env var: `VITE_POSTHOG_KEY` (optional, PostHog analytics)

**Features built:**
- Service selector: Claude, ChatGPT, Gemini, GitHub Copilot, Perplexity
- Plan selector per service (Claude Pro / Max 5x / Max 20x, etc.)
- Usage slider (0-100% of ~1,000 monthly queries)
- Token mode: paste raw token count from `/env-impact` for exact estimate
- Multiplier toggles: Reasoning Mode (x20), Long Threads (x3), Coding Heavy (x1.5)
- Quick-start presets: Casual Search, Web Developer, ChatGPT Researcher, Data Science
- Animated impact dashboard: kg CO2e, miles, kettles, smartphone charges
- Methodology section explaining the math
- Sources and research links
- Offset provider links (Climeworks, Gold Standard, Tradewater, SeaTrees, Ecologi)
- Civic action section: contact your representative, 21 countries, GitHub PR to add more
- Personal note from Nate
- Disclaimer: estimates intentionally biased toward overestimation
- PostHog analytics via env var
- SEO: JSON-LD, Open Graph, Twitter card, sitemap, robots.txt
- Copyright footer linking to n8finch.com

**Remaining:**
- Purchase myenvtracker.com and point to Netlify
- Add extension icons (PNG exports of the favicon at 16/32/48/128px)
- Update Netlify URL placeholder in README once deployed

---

## Phase 3: Browser Extension - SCAFFOLDED (not yet tested end-to-end)

MV3 extension at `browser-extension/`. Vanilla JS, no build step needed.

**Files:**
- `manifest.json` — MV3, host permissions for 3 sites
- `content.js` — MutationObserver, token estimation, `/env-impact` intercept
- `background.js` — service worker, monthly storage, carbon calculation
- `popup.html/css/js` — dashboard popup matching web app aesthetic
- `icons/` — needs PNG files at 16/32/48/128px
- `DEV.md` — load unpacked instructions

**To test:**
1. Add icons (or Chrome will warn but still load)
2. Go to `chrome://extensions`, enable Developer mode, Load unpacked, select `browser-extension/`
3. Open claude.ai and start a conversation
4. Check popup for tracked queries
5. Type `/env-impact` in chat input to test the intercept

**Known risk:** DOM selectors in `content.js` are best-effort approximations. Chat UIs update frequently. May need selector tweaks after testing on each site.

**Remaining:**
- End-to-end test on all three sites
- Fix any selectors that don't match current DOM
- Create and add extension icons
- Decide on Firefox support (needs webextension-polyfill)
- Package for Chrome Web Store (if desired)

---

## Phase 4: Other Services - NOT STARTED

Planned: extend `track.py` or create wrappers to track token usage for other services (Gemini, Copilot, etc.) via their local logs or API wrappers. Low priority until phases 1-3 are validated.

---

## Carbon Calculation Reference

| Service | Baseline (g CO2e / 1K queries) |
|---|---|
| Claude | 400 |
| ChatGPT | 250 |
| Perplexity | 300 |
| Copilot | 150 |
| Gemini | 30 |

Multipliers stack multiplicatively: Reasoning Mode x20, Long Threads x3, Coding Heavy x1.5.
Token mode: 16.4% effective-weight ratio for cache-heavy sessions.
