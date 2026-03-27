# Project Plan: AI Carbon Footprint Tracker

## Goals & Scope

Build tools to estimate and track the carbon footprint of AI usage across three phases, in priority order:

1. **Claude Code plugin** — local token tracking via `/env-impact` command
2. **Web app** — single-page calculator for estimating usage and linking to offset providers
3. **Browser extension** — live tracking on claude.ai, chatgpt.com, gemini.google.com

---

## Phase 1: Claude Code Token Tracker ✅ COMPLETE

**What it is:** A `/env-impact` slash command for Claude Code that tallies real token usage from local JSONL logs and converts to a carbon estimate.

**Files:**
- `~/.claude/plugins/env-impact/track.py` — scanner script
- `~/.claude/commands/env-impact.md` — slash command definition

**How it works:**
- Reads `~/.claude/projects/**/*.jsonl` (Claude Code's conversation logs)
- Filters assistant messages by current month's `timestamp`
- Sums: `input_tokens`, `output_tokens`, `cache_creation_input_tokens`, `cache_read_input_tokens`
- Applies coding-heavy multiplier (1.5×); cache reads weighted at 10%
- Resets automatically on the 1st of each month (filter-based, no cron needed)
- No content is ever read — only token counts from the usage block

**Usage:** Type `/env-impact` in any Claude Code session.

---

## Phase 2: Web Calculator — TODO

Single-page React app. See `project-idea.md` §1–5 for full spec.

Key outputs: calculator that takes service + usage % + multiplier toggles → CO2e, miles, kettles, smartphone charges. Footer with offset provider links.

---

## Phase 3: Browser Extension — TODO

Chrome/Edge MV3 extension. See `project-idea.md` §6 and the detailed extension spec.

Tracks token usage on claude.ai, chatgpt.com, gemini.google.com via MutationObserver. Intercepts `/env-impact` typed in chat.

---

## Carbon Calculation Reference

| Service | Baseline (g CO2e / 1K queries) |
|---------|-------------------------------|
| Claude  | 400                            |
| OpenAI  | 250                            |
| Perplexity | 300                         |
| Copilot | 150                            |
| Gemini  | 30                             |

Multipliers: reasoning mode ×20, long threads ×3, coding-heavy ×1.5 (cumulative).
