const fs = require('fs');
const path = require('path');
const { runCommandSync } = require('../utils');

const tests = fs.existsSync(path.resolve(`e2e_tests_to_test.json`))
  ? JSON.parse(fs.readFileSync(path.resolve(`e2e_tests_to_test.json`)))
  : null;

const step = Number(process.env.STEP);
const numContainers = Number(process.env.NUM_CONTAINERS);
const appUrl = process.env.APP_URLS.split(',')[0];

const divider = Math.ceil(tests.length / numContainers);

// Split up the array of tests for each container.
const batch = tests
  .map(test => test.replace('/home/runner/work', '/__w'))
  .slice(step * divider, (step + 1) * divider)
  .join(',');

const baseCmd = `yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.js" --spec '${batch}' --env app_url=${appUrl}`;

let status = null;

if (batch !== '') {
  // First run: video disabled (default config) for speed.
  status = runCommandSync(baseCmd);

  // Re-run with video on failure to capture debugging artifacts.
  if (status !== 0) {
    // eslint-disable-next-line no-console
    console.log('Re-running failed specs with video enabled...');
    status = runCommandSync(`${baseCmd} --config video=true`);
  }
} else {
  process.exit(0);
}

process.exit(status);
