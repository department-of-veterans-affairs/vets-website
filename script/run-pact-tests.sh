#!/bin/bash

if [ "$(find src -name '*.pact.spec.js' | wc -l)" -eq 0 ]; then
  echo "No Pact tests found."
  exit 0
else
  BUILDTYPE=localhost BABEL_ENV=test mocha --opts src/platform/testing/unit/mocha.opts --recursive 'src/**/tests/**/*.pact.spec.js' --timeout 10000
fi
