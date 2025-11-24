#!/bin/bash

# This script runs yeoman generator to create a new form
#
# Usage interactive:
#   yarn new:app
#
# Usage CLI:
#   yarn new:app --force --appName="My App" ...  # CLI mode (with arguments)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

YO_BIN="$PROJECT_ROOT/node_modules/.bin/yo"

if [ $# -eq 0 ]; then
  "$YO_BIN" @department-of-veterans-affairs/vets-website && npm run lint:js:untracked:fix > /dev/null 2>&1
else
  "$YO_BIN" @department-of-veterans-affairs/vets-website "$@" && npm run lint:js:untracked:fix > /dev/null 2>&1
fi
