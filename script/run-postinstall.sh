#!/bin/bash
# Shared postinstall script for vets-website
# This script runs necessary postinstall scripts for packages that require them
# Used by both CI workflows and local development after yarn install --ignore-scripts

set -e  # Exit on error

echo "Running postinstall scripts for trusted packages..."

# Apply patches to node_modules (must run first)
# Remove this and related code from package.json when this PR lands:
# https://github.com/department-of-veterans-affairs/component-library/pull/1942
echo "→ Applying patches with patch-package..."
./node_modules/.bin/patch-package

# Fix entities version conflict for renderkid's htmlparser2
# htmlparser2@6.1.0 requires entities@^2.0.0 with old API, but the global
# resolution forces entities@4.5.0 which has a different exports structure
HTMLPARSER2_DIR="node_modules/renderkid/node_modules/htmlparser2"
if [ -d "$HTMLPARSER2_DIR" ] && [ ! -d "$HTMLPARSER2_DIR/node_modules/entities" ]; then
  echo "→ Installing entities@2.2.0 for renderkid/htmlparser2 compatibility..."
  mkdir -p "$HTMLPARSER2_DIR/node_modules/entities"
  npm pack entities@2.2.0 --silent 2>/dev/null
  tar -xzf entities-2.2.0.tgz -C "$HTMLPARSER2_DIR/node_modules/entities" --strip-components=1
  rm -f entities-2.2.0.tgz
fi

# Run postinstall scripts for ES5 transpiled packages (required by Bot Framework)
echo "→ Running postinstall for p-defer-es5..."
cd node_modules/p-defer-es5 && yarn run postinstall && cd ../..

echo "→ Running postinstall for abort-controller-es5..."
cd node_modules/abort-controller-es5 && yarn run postinstall && cd ../..

echo "→ Running postinstall for markdown-it-attrs-es5..."
cd node_modules/markdown-it-attrs-es5 && yarn run postinstall && cd ../..

if ! npx cypress verify &>/dev/null; then
  echo "→ Installing Cypress binary..."
  npx cypress install
fi

echo "✓ Postinstall scripts completed successfully"
