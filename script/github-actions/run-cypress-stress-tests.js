const fs = require('fs');
const path = require('path');
const { runCommandSync } = require('../utils');

const testsRaw = fs.existsSync(path.resolve(`e2e_tests_to_stress_test.json`))
  ? JSON.parse(fs.readFileSync(path.resolve(`e2e_tests_to_stress_test.json`)))
  : null;

const tests = Array.isArray(testsRaw) ? [...new Set(testsRaw)].join(',') : '';

const localCypress = path.resolve('node_modules/.bin/cypress');
const localCmd = fs.existsSync(localCypress)
  ? `${localCypress} run --config-file config/cypress.config.js --browser chrome --headless --reporter cypress-multi-reporters --reporter-options configFile=config/cypress-reporters.js`
  : null;
const npxCmd =
  'npx cypress run --config-file config/cypress.config.js --browser chrome --headless --reporter cypress-multi-reporters --reporter-options configFile=config/cypress-reporters.js';
const cyCmd =
  'yarn cy:run --quiet --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.js"';

let status = 1;
if (localCmd) {
  status = runCommandSync(
    `CYPRESS_EVERY_NTH_FRAME=1 ${localCmd} --spec '${tests}'`,
  );
}
if (status !== 0) {
  status = runCommandSync(
    `CYPRESS_EVERY_NTH_FRAME=1 ${npxCmd} --spec '${tests}'`,
  );
}
if (status !== 0) {
  status = runCommandSync(
    `CYPRESS_EVERY_NTH_FRAME=1 ${cyCmd} --spec '${tests}'`,
  );
}

process.exit(status);
