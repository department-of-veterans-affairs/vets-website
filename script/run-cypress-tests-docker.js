const { runCommand } = require('./utils');
const exec = require('child_process').exec;

exec("find src -name '*.cypress.*.js' | tr '\n' ','", function(_err, stdout) {
  const stepNumber = Number(process.env.STEP);
  const longestTest =
    'src/applications/disability-benefits/all-claims/tests/all-claims.cypress.spec.js';
  const strings = stdout.split(',').sort();
  const index = strings.indexOf(longestTest);

  if (index > -1) {
    strings.splice(index, 1);
  }
  const divider = Math.ceil(strings.length / 6);

  let tests;
  if (stepNumber === 5) {
    tests = longestTest;
  } else {
    tests = strings
      .slice(
        Number(process.env.STEP) * divider,
        (Number(process.env.STEP) + 1) * divider,
      )
      .join(',');
  }

  runCommand(
    `CYPRESS_BASE_URL=http://vets-website:3001 CYPRESS_CI=${
      process.env.CI
    } XDG_CONFIG_HOME=/tmp/cyhome${
      process.env.STEP
    } yarn cy:run --config video=false --spec '${tests}'`,
  );
});
