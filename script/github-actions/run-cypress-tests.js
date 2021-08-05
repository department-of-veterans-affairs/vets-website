const { runCommandSync } = require('../utils');

const tests = process.env.TESTS;
const step = process.env.STEP;
const divider = Math.ceil(tests.length / process.env.NUM_CONTAINERS);
const batch = tests
  .slice(Number(step) * divider, (Number(step) + 1) * divider)
  .join(',');

const status = runCommandSync(
  `yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json" --spec '${batch}'`,
);

process.exit(status);
