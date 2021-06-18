const path = require('path');
const glob = require('glob');
const { runCommandSync } = require('../utils');
const { integrationFolder, testFiles } = require('../../config/cypress.json');

const pattern = path.join(__dirname, '../..', integrationFolder, testFiles);
const tests = glob.sync(pattern);
const divider = Math.ceil(tests.length / 6);
const batch = tests
  .slice(
    Number(process.env.STEP) * divider,
    (Number(process.env.STEP) + 1) * divider,
  )
  .join(',');

runCommandSync(
  `yarn cy:run --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json" --spec '${batch}'`,
);
