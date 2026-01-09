#!/bin/bash
# Shared postinstall script for vets-website
# This script runs necessary postinstall scripts for packages that require them
# Used by both CI workflows and local development after yarn install --ignore-scripts

set -e  # Exit on error

echo "Running postinstall scripts for trusted packages..."

# Patch css-library Sass to avoid @use/@import variable collisions under Dart Sass.
CSS_LIBRARY_OVERRIDES_FILE="node_modules/@department-of-veterans-affairs/css-library/dist/stylesheets/formation-overrides/_variables.scss"
if [ -f "$CSS_LIBRARY_OVERRIDES_FILE" ]; then
  perl -0pi -e "s|@use '../override-function' as \\*;|@import '../override-function';|g" "$CSS_LIBRARY_OVERRIDES_FILE"
fi

# Rebuild Dart Sass binary (required when installing with --ignore-scripts)
echo "→ Rebuilding sass binary..."
npm rebuild sass

# Rebuild node-sass native bindings (legacy)
if [ -f node_modules/node-sass/scripts/install.js ]; then
  echo "→ Rebuilding node-sass native binaries (legacy)..."
  node node_modules/node-sass/scripts/install.js
else
  echo "→ node-sass not present; skipping rebuild"
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
