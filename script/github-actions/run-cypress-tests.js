const fs = require('fs');
const path = require('path');
const { runCommandSync } = require('../utils');

const tests = fs.existsSync(path.resolve(`e2e_tests_to_test.json`))
  ? JSON.parse(fs.readFileSync(path.resolve(`e2e_tests_to_test.json`)))
  : null;

const appUrl = process.env.APP_URLS.split(',')[0];

// Pass all specs to Cypress — cypress-split handles distribution
// across containers using SPLIT and SPLIT_INDEX env vars.
const allSpecs = tests
  .map(test => test.replace('/home/runner/work', '/__w'))
  .join(',');

let status = null;

if (allSpecs !== '') {
  status = runCommandSync(
    `yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.js" --spec '${allSpecs}' --env app_url=${appUrl}`,
  );
} else {
  process.exit(0);
}

process.exit(status);
