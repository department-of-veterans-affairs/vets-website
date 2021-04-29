const { runCommand } = require('./utils');
const exec = require('child_process').exec;

exec("find src -name '*.cypress.*.js' | tr '\n' ','", function(_err, stdout) {
  const strings = stdout.split(',');
  const divider = Math.ceil(strings.length / process.env.NUM_STEPS);
  const tests = strings
    .slice(
      Number(process.env.STEP) * divider,
      (Number(process.env.STEP) + 1) * divider,
    )
    .join(',');

  // to-do: add percy token to run command
  runCommand(
    `CYPRESS_BASE_URL=http://vets-website:3001 CYPRESS_CI=${
      process.env.CI
    } PERCY_PARALLEL_NONCE=${
      process.env.PERCY_PARALLEL_NONCE
    } PERCY_PARALLEL_TOTAL=${
      process.env.NUM_STEPS
    } yarn cy:run --config video=false --spec '${tests}'`,
  );
});
