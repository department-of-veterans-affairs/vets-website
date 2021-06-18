const path = require('path');
const glob = require('glob');
const { runCommandSync } = require('../utils');

const searchPath = path.join(__dirname, '../../src/**/*.cypress.spec.js');
const tests = glob.sync(searchPath);
const divider = Math.ceil(tests.length / 6);
const batch = tests
  .slice(
    Number(process.env.STEP) * divider,
    (Number(process.env.STEP) + 1) * divider,
  )
  .join(',');

runCommandSync(
  `CYPRESS_CI=true yarn cy:run --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json" --config baseUrl=http://localhost:${
    process.env.CYPRESS_PORT
  } --port ${process.env.CYPRESS_PORT} --spec '${batch}'`,
);
