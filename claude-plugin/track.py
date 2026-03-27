#!/usr/bin/env python3
"""
env-impact: Track carbon footprint of Claude Code token usage.
Data source: ~/.claude/projects/**/*.jsonl

Each assistant message in the JSONL has a usage block:
  input_tokens, output_tokens, cache_creation_input_tokens, cache_read_input_tokens
"""

import json
from datetime import datetime, timezone
from pathlib import Path

# Carbon constants
# Claude baseline: 400g CO2e per 1,000 standard queries (2026 benchmark)
# Coding-heavy multiplier: 1.5x (Claude Code sessions are coding-heavy by definition)
# Assumed tokens per standard query: ~2,000 (input + output combined)
# Per-token rate: (400g * 1.5) / (1000 queries * 2000 tokens) = 0.3g per 1000 tokens
GRAMS_PER_1K_TOKENS = 0.3

# Cache reads use much less compute than fresh tokens
CACHE_READ_WEIGHT = 0.1

# CO2e equivalences (grams)
GRAMS_PER_MILE = 400        # average passenger vehicle
GRAMS_PER_KETTLE = 15       # boiling 1 liter of water
GRAMS_PER_SMARTPHONE = 8    # one full charge


def get_current_month():
    now = datetime.now(timezone.utc)
    return now.year, now.month


def scan_projects(year, month):
    projects_dir = Path.home() / ".claude" / "projects"
    totals = dict(input=0, output=0, cache_created=0, cache_read=0, api_calls=0)

    if not projects_dir.exists():
        return totals

    for jsonl_file in projects_dir.glob("**/*.jsonl"):
        try:
            with open(jsonl_file, encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        obj = json.loads(line)
                    except json.JSONDecodeError:
                        continue

                    if obj.get("type") != "assistant":
                        continue

                    ts = obj.get("timestamp", "")
                    if not ts:
                        continue
                    try:
                        dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
                        if dt.year != year or dt.month != month:
                            continue
                    except (ValueError, TypeError):
                        continue

                    usage = obj.get("message", {}).get("usage", {})
                    if not usage:
                        continue

                    totals["input"] += usage.get("input_tokens", 0)
                    totals["output"] += usage.get("output_tokens", 0)
                    totals["cache_created"] += usage.get("cache_creation_input_tokens", 0)
                    totals["cache_read"] += usage.get("cache_read_input_tokens", 0)
                    totals["api_calls"] += 1
        except (OSError, PermissionError):
            continue

    return totals


def main():
    year, month = get_current_month()
    month_name = datetime(year, month, 1).strftime("%B %Y")

    t = scan_projects(year, month)

    raw_total = t["input"] + t["output"] + t["cache_created"] + t["cache_read"]
    weighted = t["input"] + t["output"] + t["cache_created"] + t["cache_read"] * CACHE_READ_WEIGHT

    grams = weighted / 1000 * GRAMS_PER_1K_TOKENS
    kg = grams / 1000

    print(f"\nAI Carbon Footprint — {month_name}")
    print("=" * 44)
    print(f"\n  Token usage this month:")
    print(f"    Input:           {t['input']:>12,}")
    print(f"    Output:          {t['output']:>12,}")
    print(f"    Cache (created): {t['cache_created']:>12,}")
    print(f"    Cache (reads):   {t['cache_read']:>12,}")
    print(f"    API calls:       {t['api_calls']:>12,}")
    print(f"    Total raw:       {raw_total:>12,}")
    print(f"\n  Estimated carbon impact:")
    print(f"    {kg:.4f} kg CO2e")
    print(f"    ~ {grams / GRAMS_PER_MILE:.1f} miles driven")
    print(f"    ~ {grams / GRAMS_PER_KETTLE:.0f} kettles boiled")
    print(f"    ~ {grams / GRAMS_PER_SMARTPHONE:.0f} smartphone charges")
    print(f"\n  Methodology: Claude coding baseline (400g CO2e/1K queries,")
    print(f"  1.5x coding multiplier). Cache reads weighted at 10%.")
    print(f"  Resets automatically on the 1st of each month.")
    print()


if __name__ == "__main__":
    main()
