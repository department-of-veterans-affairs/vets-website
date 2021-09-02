const { runCommandSync } = require('../utils');

const tests = JSON.parse(process.env.TESTS);
const step = Number(process.env.STEP);
const numContainers = Number(process.env.NUM_CONTAINERS);
const divider = Math.ceil(tests.length / numContainers);

const batch = tests
  .map(test => test.replace('/home/runner/work', '/__w'))
  .slice(Number(step) * divider, (Number(step) + 1) * divider)
  .join(',');

const status = runCommandSync(
  `PERCY_TOKEN=${process.env.PERCY_TOKEN} PERCY_PARALLEL_NONCE=${
    process.env.PERCY_PARALLEL_NONCE
  } PERCY_PARALLEL_TOTAL=${numContainers} yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json" --spec '${batch}'`,
);

process.exit(status);
