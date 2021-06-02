#!/bin/bash

if [ "$(find src -name '*.cypress.spec.js' | wc -l)" -eq 0 ]; then
  echo "No Cypress tests found."
  exit 0
else
  # Flags to indicate to tests that they are running in a CI environment
  # and also that they are running in CircleCI specifically.
  export CYPRESS_CI=$CI

  # Run Cypress tests.
  yarn cy:run --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json"
fi
