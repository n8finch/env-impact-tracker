#!/usr/bin/env bash
# install.sh — symlink the Claude Code env-impact plugin into ~/.claude/
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PLUGIN_DIR="$HOME/.claude/plugins/env-impact"
COMMANDS_DIR="$HOME/.claude/commands"

mkdir -p "$PLUGIN_DIR" "$COMMANDS_DIR"

# track.py
TARGET="$PLUGIN_DIR/track.py"
if [ -L "$TARGET" ]; then
  rm "$TARGET"
elif [ -f "$TARGET" ]; then
  echo "Backing up existing track.py to $TARGET.bak"
  mv "$TARGET" "$TARGET.bak"
fi
ln -s "$SCRIPT_DIR/track.py" "$TARGET"
echo "Linked: $TARGET -> $SCRIPT_DIR/track.py"

# env-impact.md (the /env-impact command)
TARGET="$COMMANDS_DIR/env-impact.md"
if [ -L "$TARGET" ]; then
  rm "$TARGET"
elif [ -f "$TARGET" ]; then
  echo "Backing up existing env-impact.md to $TARGET.bak"
  mv "$TARGET" "$TARGET.bak"
fi
ln -s "$SCRIPT_DIR/env-impact.md" "$TARGET"
echo "Linked: $TARGET -> $SCRIPT_DIR/env-impact.md"

echo ""
echo "Done. Run /env-impact in any Claude Code session."
