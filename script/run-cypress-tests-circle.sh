#!/bin/bash

if [ "$(find src -name '*.cypress.spec.js' | wc -l)" -eq 0 ]; then
  echo "No Cypress tests found."
  exit 0
else
  # Use mocha-junit-reporter and save results in './test-results'.
  reporterArgs="--reporter cypress-multi-reporters --reporter-options \"configFile=config/cypress-reporters.json\""

  # Start the web server & run Cypress tests.
  # Wait for http://localhost:3001/generated/style.css to finish bundling so Cypress doesn't start too soon.
  yarn start-server-and-test "node src/platform/testing/e2e/test-server.js --buildtype=vagovprod --port=3001 > /dev/null 2>&1" :3001 "yarn cy:run $reporterArgs"
fi
