const { runCommandSync } = require('../utils');

const tests = JSON.parse(process.env.TESTS);
const step = Number(process.env.STEP);
const numContainers = Number(process.env.NUM_CONTAINERS);
const divider = Math.ceil(tests.length / numContainers);
const appURL = process.env.APP_URLS.split(',')[0];

const batch = tests
  .map(test => test.replace('/home/runner/work', '/__w'))
  .slice(step * divider, (step + 1) * divider)
  .join(',');

if (batch !== '') {
  const status = runCommandSync(
    `yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json" --spec '${batch}' --env app_url=${appURL}`,
  );
  process.exit(status);
} else {
  process.exit(0);
}
