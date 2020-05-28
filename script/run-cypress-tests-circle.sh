#!/bin/bash

# Use the junit reporter & save results in './test-results'.
reporterArgs="--reporter junit --reporter-options \"mochaFile=test-results/e2e-test-output-[hash].xml\""
    
# Use the CircleCI CLI to get Cypress tests & split them on different machines by timing. Commas are inserted as the delimiter for file paths.
specArgs="--spec $(echo '"$(circleci tests glob "src/**/tests/**/*.cypress.spec.js" | circleci tests split --split-by=timings | paste -sd "," -)"')"

# Start the server & wait for 'http://localhost:3001' to go live.
yarn start-server-and-test watch http://localhost:3001 "cypress run $reporterArgs $specArgs"
