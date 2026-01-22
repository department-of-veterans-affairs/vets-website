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

# Run postinstall scripts for ES5 transpiled packages (required by Bot Framework)
# These packages transpile their source code during postinstall using esbuild and babel
# Defensive checks prevent failures when packages are missing or build tools unavailable

run_es5_postinstall() {
  local package_name=$1
  echo "→ Running postinstall for ${package_name}..."

  if [ ! -d "node_modules/${package_name}" ]; then
    echo "⚠ Warning: ${package_name} directory not found, skipping"
    return 0
  fi

  if [ ! -f "node_modules/${package_name}/package.json" ]; then
    echo "⚠ Warning: ${package_name}/package.json not found, skipping"
    return 0
  fi

  # Check if lib directory already exists (package already built)
  if [ -d "node_modules/${package_name}/lib" ] && [ -n "$(ls -A node_modules/${package_name}/lib 2>/dev/null)" ]; then
    echo "  ✓ ${package_name} already built, skipping"
    return 0
  fi

  # Run the postinstall in the package directory
  if (cd "node_modules/${package_name}" && yarn run postinstall 2>&1); then
    echo "  ✓ ${package_name} postinstall completed"
  else
    echo "⚠ Warning: ${package_name} postinstall failed, but continuing..."
    # Don't fail the entire script - these packages may work with pre-built fallbacks
    return 0
  fi
}

run_es5_postinstall "p-defer-es5"
run_es5_postinstall "abort-controller-es5"
run_es5_postinstall "markdown-it-attrs-es5"

if ! npx cypress verify &>/dev/null; then
  echo "→ Installing Cypress binary..."
  npx cypress install
fi

echo "✓ Postinstall scripts completed successfully"
