const { runCommandSync } = require('../utils');

const tests = JSON.parse(process.env.TESTS);
const step = Number(process.env.STEP);
const divider = Math.ceil(tests.length / Number(process.env.NUM_CONTAINERS));

const batch = tests
  .map(test => test.replace('/home/runner/work', '/__w'))
  .slice(Number(step) * divider, (Number(step) + 1) * divider)
  .join(',');

const status = runCommandSync(
  `yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json" --reportFilename results-${
    process.env.STEP
  } --spec '${batch}'`,
);

process.exit(status);
