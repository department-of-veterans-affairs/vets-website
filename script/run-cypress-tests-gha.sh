#!/bin/bash

if [ "$(find src -name '*.cypress.spec.js' | wc -l)" -eq 0 ]; then
  echo "No Cypress tests found."
  exit 0
else
  # Flags to indicate to tests that they are running in a CI environment
  # and also that they are running in CircleCI specifically.
  export CYPRESS_CI=$CI

  # Use mocha-junit-reporter and save results in './test-results'.
  reporterArgs="--reporter cypress-multi-reporters --reporter-options \"configFile=config/cypress-reporters.json\" --spec \"src/applications/coronavirus-vaccination/tests/e2e/hideauth.cypress.spec.js,src/applications/coronavirus-vaccination/tests/e2e/unsubscribe.cypress.spec.js\""

  # Run Cypress tests.
  yarn cy:run $reporterArgs
fi
