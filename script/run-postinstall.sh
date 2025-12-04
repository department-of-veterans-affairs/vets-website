#!/bin/bash
# Shared postinstall script for vets-website
# This script runs necessary postinstall scripts for packages that require them
# Used by both CI workflows and local development after yarn install --ignore-scripts

set -e  # Exit on error

echo "Running postinstall scripts for trusted packages..."

# Rebuild node-sass native bindings
echo "→ Rebuilding node-sass..."
node node_modules/node-sass/scripts/install.js

# Run postinstall scripts for ES5 transpiled packages (required by Bot Framework)
echo "→ Running postinstall for p-defer-es5..."
cd node_modules/p-defer-es5 && yarn run postinstall && cd ../..

echo "→ Running postinstall for abort-controller-es5..."
cd node_modules/abort-controller-es5 && yarn run postinstall && cd ../..

echo "→ Running postinstall for markdown-it-attrs-es5..."
cd node_modules/markdown-it-attrs-es5 && yarn run postinstall && cd ../..

echo "✓ Postinstall scripts completed successfully"
