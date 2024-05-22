const fs = require('fs');
const path = require('path');
const { runCommandSync } = require('../utils');

let tests = fs.existsSync(path.resolve(`e2e_tests_to_test.json`))
  ? JSON.parse(fs.readFileSync(path.resolve(`e2e_tests_to_test.json`)))
  : null;

const step = Number(process.env.STEP);
const numContainers = Number(process.env.NUM_CONTAINERS);
const appUrl = process.env.APP_URLS.split(',')[0];

// The following logic checks if the longest-running test has been selected.
// If it has been selected, it is run in its own container in the last parallel container.
let divider;
let longestTestIsPresent = false;
const longestTestFilename = `long-ptsd.cypress.spec.js`;
const longestTestPattern = new RegExp(longestTestFilename, 'g');
const lastStep = numContainers - 1;

if (tests.some(test => test.match(longestTestPattern))) {
  longestTestIsPresent = true;
  divider = Math.ceil(tests.length / (numContainers - 1));
  tests = tests.filter(test => !test.match(longestTestPattern));
} else {
  divider = Math.ceil(tests.length / numContainers);
}

// Split up the array of tests for each container.
const batch = tests
  .map(test => test.replace('/home/runner/work', '/__w'))
  .slice(step * divider, (step + 1) * divider)
  .join(',');

let status = null;

if (longestTestIsPresent && step === lastStep) {
  status = runCommandSync(
    `CYPRESS_EVERY_NTH_FRAME=1 yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.js" --spec 'src/applications/**/${longestTestFilename}' --env app_url=${appUrl}`,
  );
} else if (batch !== '') {
  status = runCommandSync(
    `CYPRESS_EVERY_NTH_FRAME=1 yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.js" --spec '${batch}' --env app_url=${appUrl}`,
  );
} else {
  process.exit(0);
}

process.exit(status);
