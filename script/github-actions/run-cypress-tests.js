const { runCommandSync } = require('../utils');

const tests = JSON.parse(process.env.TESTS);
const step = Number(process.env.STEP);
const numContainers = Number(process.env.NUM_CONTAINERS);
const divider = Math.ceil(tests.length / numContainers);
const appUrl = process.env.APP_URLS.split(',')[0];

const batch = tests
  .map(test => test.replace('/home/runner/work', '/__w'))
  .slice(step * divider, (step + 1) * divider)
  .join(',');

if (tests.join(',').includes('all-claims.cypress.spec.js') && step === 11) {
  const status = runCommandSync(
    `CYPRESS_EVERY_NTH_FRAME=1 yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json" --spec /__w/vets-website/vets-website/src/applications/disability-benefits/all-claims/tests/all-claims.cypress.spec.js --env app_url=${appUrl}`,
  );
  process.exit(status);
}

if (batch.includes('all-claims.cypress.spec.js') && step !== 11) {
  const status = runCommandSync(
    `CYPRESS_EVERY_NTH_FRAME=1 yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json" --spec '${batch.replace(
      '/__w/vets-website/vets-website/src/applications/disability-benefits/all-claims/tests/all-claims.cypress.spec.js',
      '',
    )}' --env app_url=${appUrl}`,
  );
  process.exit(status);
}

if (batch !== '') {
  const status = runCommandSync(
    `CYPRESS_EVERY_NTH_FRAME=1 yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json" --spec '${batch}' --env app_url=${appUrl}`,
  );
  process.exit(status);
} else {
  process.exit(0);
}
