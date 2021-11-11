const { runCommandSync } = require('../utils');

const tests = JSON.parse(process.env.TESTS);
const step = Number(process.env.STEP);
const divider = Math.ceil(tests.length / 8);

const batch = tests
  .map(test => test.replace('/home/runner/work', '/__w'))
  .slice(step * divider, (step + 1) * divider)
  .join(',');

if (batch !== '') {
  const status = runCommandSync(
    `yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json" --spec '${batch}'`,
  );
  process.exit(status);
} else {
  process.exit(0);
}
