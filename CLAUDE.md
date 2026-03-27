# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An AI carbon footprint calculator with two planned phases:
1. **Phase 1 (Web App):** Single-page React calculator for estimating CO2 impact of AI usage
2. **Phase 2 (Browser Extension):** Chrome/Edge MV3 extension tracking live token usage on claude.ai, chatgpt.com, gemini.google.com

See `project-idea.md` for the full spec and roadmap.

## Phase 1: Claude Code Token Tracker (COMPLETE)

Files live outside this repo:
- `~/.claude/plugins/env-impact/track.py` — scanner script
- `~/.claude/commands/env-impact.md` — `/env-impact` slash command

**How it works:** Reads `~/.claude/projects/**/*.jsonl`, filters assistant messages by current month's `timestamp`, sums token counts from the `usage` block. No content is read. Monthly reset is automatic (filter-based). Run `/env-impact` in any Claude Code session.

**Carbon math:** Claude coding baseline (400g CO2e/1K queries × 1.5× coding multiplier = 0.3g/1K tokens). Cache reads weighted at 10%.

---

## Phase 2: Web Calculator

### Stack
React + Tailwind CSS + Lucide-react icons, Vite recommended as build tool.

### Commands (once scaffolded, run from project root)
```bash
npm run dev      # Dev server
npm run build    # Production build
npm run lint     # ESLint
```

### Core Calculation Engine

The central function `calculateImpact(service, usagePercent, options)`:
- **Baseline emissions** (grams CO2e per 1,000 queries): Claude 400g, OpenAI 250g, Perplexity 300g, Copilot 150g, Gemini 30g
- **Multipliers** (cumulative): reasoning mode ×20, long threads ×3, coding-heavy ×1.5
- **Output conversions**: kg CO2e, car miles (~400g/mile), kettles boiled (~15g/kettle), smartphone charges (~8g/charge)

### UI/UX Requirements
- Dark mode (anthracite gray) with emerald green accents — "Eco-SaaS" aesthetic
- Dashboard numbers animate with an "odometer-roll" effect when the slider changes
- Usage slider represents 0–100% of a "Pro" plan's ~1,000 monthly queries

### Offset/Removal Section
- Tier 1 (Permanent Removal): Climeworks (DAC)
- Tier 2 (High-Quality Offsets): Gold Standard, Tradewater
- Tier 3 (Nature-Based): SeaTrees, Ecologi

## Phase 2: Browser Extension

### Architecture
- **`content.js`** — MutationObserver watches chat DOM; estimates tokens via `(char_count / 4) * multiplier`; intercepts `/env-impact` typed in any chat input (prevents send, shows carbon report instead); detects reasoning mode via CSS selectors (`.claude-thinking-state`, `.gpt-thought-container`) to trigger ×20 multiplier
- **`background.js`** — Service worker receives token events, persists to `chrome.storage.local`
- **`popup.html`** — Extension popup dashboard

### Key Implementation Details
- Manifest V3; `host_permissions` for claude.ai, chatgpt.com, gemini.google.com
- Token heuristic: `character_count / 4` (no access to official tokenizers)
- **Privacy model:** only tracks message/response length, never message content; all storage is local-only

## Privacy Principle
Both phases: zero cloud syncing, no API keys required from users, no content read — only string lengths.
