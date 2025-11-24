#!/bin/bash

# This script wraps the Yeoman generator to allow both interactive and CLI usage
# Usage:
#   yarn new:app                    # Interactive mode (no arguments)
#   yarn new:app --force --appName="My App" ...  # CLI mode (with arguments)

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Path to the yo executable in node_modules
YO_BIN="$PROJECT_ROOT/node_modules/.bin/yo"

# Check if any arguments were passed
if [ $# -eq 0 ]; then
  # No arguments - run in interactive mode
  "$YO_BIN" @department-of-veterans-affairs/vets-website && npm run lint:js:untracked:fix > /dev/null 2>&1
else
  # Arguments provided - pass them through to yo
  "$YO_BIN" @department-of-veterans-affairs/vets-website "$@" && npm run lint:js:untracked:fix > /dev/null 2>&1
fi
