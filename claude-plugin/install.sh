#!/usr/bin/env bash
# EcoAI — Claude Code /env-impact plugin installer
# Downloads track.py and env-impact.md from GitHub. No repo clone needed.
#
# Usage (one-liner):
#   curl -fsSL https://raw.githubusercontent.com/n8finch/env-impact-tracker/main/claude-plugin/install.sh | bash
#
# Or, if you have the repo cloned locally:
#   bash claude-plugin/install.sh

set -euo pipefail

RAW_BASE="https://raw.githubusercontent.com/n8finch/env-impact-tracker/main/claude-plugin"
PLUGIN_DIR="$HOME/.claude/plugins/env-impact"
COMMANDS_DIR="$HOME/.claude/commands"

echo "EcoAI — installing /env-impact Claude Code plugin..."
echo ""

# Check for Python 3
if ! command -v python3 &>/dev/null; then
  echo "Error: python3 is required but was not found in PATH." >&2
  exit 1
fi

mkdir -p "$PLUGIN_DIR" "$COMMANDS_DIR"

# ---------------------------------------------------------------------------
# Download or symlink track.py
# If the script is being run from inside the cloned repo, symlink instead of
# downloading so local edits are reflected immediately.
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-install.sh}")" 2>/dev/null && pwd || echo "")"
LOCAL_TRACK="$SCRIPT_DIR/track.py"
TARGET_TRACK="$PLUGIN_DIR/track.py"

install_file() {
  local local_src="$1"
  local remote_url="$2"
  local dest="$3"
  local label="$4"

  # Back up any existing plain file
  if [ -f "$dest" ] && [ ! -L "$dest" ]; then
    echo "  Backing up existing $label to $dest.bak"
    mv "$dest" "$dest.bak"
  fi
  [ -L "$dest" ] && rm "$dest"

  if [ -f "$local_src" ]; then
    ln -s "$local_src" "$dest"
    echo "  Linked (local):  $dest"
  else
    curl -fsSL "$remote_url" -o "$dest"
    echo "  Downloaded:      $dest"
  fi
}

install_file "$LOCAL_TRACK" \
  "$RAW_BASE/track.py" \
  "$TARGET_TRACK" \
  "track.py"

install_file "$SCRIPT_DIR/env-impact.md" \
  "$RAW_BASE/env-impact.md" \
  "$COMMANDS_DIR/env-impact.md" \
  "env-impact.md"

echo ""
echo "Done! Open any Claude Code session and run:"
echo ""
echo "  /env-impact"
echo ""
echo "To uninstall:"
echo "  rm ~/.claude/plugins/env-impact/track.py"
echo "  rm ~/.claude/commands/env-impact.md"
