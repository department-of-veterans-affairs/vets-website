const { runCommandSync } = require('../utils');

const tests = JSON.parse(process.env.TESTS);
const step = Number(process.env.STEP);

// eslint-disable-next-line no-console
console.log('tests: ', tests);

// eslint-disable-next-line no-console
console.log('typeof tests: ', typeof tests);

// eslint-disable-next-line no-console
console.log('tests.length: ', tests.length);

// eslint-disable-next-line no-console
console.log('step: ', step);

// eslint-disable-next-line no-console
console.log('NUM_CONTAINERS: ', Number(process.env.NUM_CONTAINERS));

const divider = Math.ceil(tests.length / Number(process.env.NUM_CONTAINERS));

// eslint-disable-next-line no-console
console.log('divider: ', divider);

const batch = tests
  .slice(Number(step) * divider, (Number(step) + 1) * divider)
  .join(',');

const status = runCommandSync(
  `yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json" --spec '${batch}'`,
);

process.exit(status);
