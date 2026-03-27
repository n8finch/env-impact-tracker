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
git clone <this-repo>
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

## Web Calculator *(coming soon)*

A single-page app to estimate your monthly AI carbon footprint by service (Claude, ChatGPT, Gemini, Copilot, Perplexity) with usage sliders and multiplier toggles. Includes links to verified carbon offset and removal providers.

---

## Browser Extension *(coming soon)*

A Chrome/Edge extension that monitors token usage live on `claude.ai`, `chatgpt.com`, and `gemini.google.com`. Intercepts a `/env-impact` command typed in any chat to show a carbon report without sending a message. Zero content read — tracks only message length.

---

## Project structure

```
claude-plugin/      # Phase 1: Claude Code /env-impact command
web-app/            # Phase 2: React calculator (coming soon)
browser-extension/  # Phase 3: Chrome/Edge extension (coming soon)
```
