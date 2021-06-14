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
  const port =
    (Number(process.env.PORT_ID) % 1000) + 3000 + Number(process.env.STEP);

  runCommand(
    `CYPRESS_CI=${
      process.env.CI
    } yarn cy:run --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.json" --port ${port} --spec '${tests}'`,
  );
});
