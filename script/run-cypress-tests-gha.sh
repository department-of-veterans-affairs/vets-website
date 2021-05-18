#!/bin/bash

if [ "$(find src -name '*.cypress.spec.js' | wc -l)" -eq 0 ]; then
  echo "No Cypress tests found."
  exit 0
else
  # Flags to indicate to tests that they are running in a CI environment
  # and also that they are running in CircleCI specifically.
  export CYPRESS_CI=$CI
  # export CYPRESS_CIRCLECI=$CIRCLECI

  # Use mocha-junit-reporter and save results in './test-results'.
  reporterArgs="--reporter cypress-multi-reporters --reporter-options \"configFile=config/cypress-reporters.json\""

  # Run Cypress tests.
  yarn cy:run $reporterArgs
fi
