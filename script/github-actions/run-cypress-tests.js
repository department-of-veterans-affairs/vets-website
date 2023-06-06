const { runCommandSync } = require('../utils');

let tests = JSON.parse(process.env.TESTS);
const step = Number(process.env.STEP);
const numContainers = Number(process.env.NUM_CONTAINERS);
const appUrl = process.env.APP_URLS.split(',')[0];
const isStressTest = process.env.IS_STRESS_TEST;

// The following logic checks if the longest-running test has been selected.
// If it has been selected, it is run in its own container in the last parallel container.
let divider;
let longestTestIsPresent = false;
const longestTest = /all-claims.cypress.spec.js/g;
const lastStep = numContainers - 1;

if (tests.some(test => test.match(longestTest))) {
  longestTestIsPresent = true;
  divider = Math.ceil(tests.length / (numContainers - 1));
  tests = tests.filter(test => !test.match(longestTest));
} else {
  divider = Math.ceil(tests.length / numContainers);
}

// Split up the array of tests for each container.
const batch = tests
  .map(test => test.replace('/home/runner/work', '/__w'))
  .slice(step * divider, (step + 1) * divider)
  .join(',');

let status = null;
const runTestsInLoopUpTo = isStressTest ? 25 : 1;

for (let i = 0; i < runTestsInLoopUpTo; i += 1) {
  if (longestTestIsPresent && step === lastStep) {
    status = runCommandSync(
      `CYPRESS_EVERY_NTH_FRAME=1 yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.js" --spec 'src/applications/**/all-claims.cypress.spec.js' --env app_url=${appUrl}`,
    );
  } else if (batch !== '') {
    status = runCommandSync(
      `CYPRESS_EVERY_NTH_FRAME=1 yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.js" --spec '${batch}' --env app_url=${appUrl}`,
    );
  } else {
    process.exit(0);
  }
}

process.exit(status);
