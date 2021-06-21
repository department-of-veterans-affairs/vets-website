const { runCommand } = require('./utils');
const exec = require('child_process').exec;

exec("find src -name '*.cypress.*.js' | tr '\n' ','", function(_err, stdout) {
  const strings = stdout.split(',').sort();
  const divider = Math.ceil(strings.length / 6);
  const tests = strings
    .slice(
      Number(process.env.STEP) * divider,
      (Number(process.env.STEP) + 1) * divider,
    )
    .join(',');

  runCommand(
    `CYPRESS_CI=${
      process.env.CI
    } yarn cy:run --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json" --config baseUrl=http://localhost:${
      process.env.CYPRESS_PORT
    } --port ${Number(process.env.CYPRESS_PORT) - 1} --spec '${tests}'`,
  );
});
