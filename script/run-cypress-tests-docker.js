const { runCommand } = require('./utils');
const exec = require('child_process').exec;

// exec("find src -name '*.cypress.*.js' | tr '\n' ','", function(_err, stdout) {
//   const strings = stdout.split(',');
//   const divider = Math.ceil(strings.length / process.env.NUM_STEPS);
//   const tests = strings
//     .slice(
//       Number(process.env.STEP) * divider,
//       (Number(process.env.STEP) + 1) * divider,
//     )
//     .join(',');

//   runCommand(
//     `CYPRESS_BASE_URL=http://vets-website:3001 CYPRESS_CI=${
//       process.env.CI
//     } PERCY_TOKEN=${process.env.PERCY_TOKEN} PERCY_PARALLEL_NONCE=${
//       process.env.PERCY_PARALLEL_NONCE
//     } PERCY_PARALLEL_TOTAL=${
//       process.env.NUM_STEPS
//     } yarn cy:run --config video=false --spec '${tests}'`,
//   );
// });

exec("find src -name '*.cypress.*.js' | tr '\n' ','", function(_err, stdout) {
  /* eslint-disable no-console */
  console.log('PERCY_TOKEN: ', process.env.PERCY_TOKEN);
  console.log('NUM_STEPS: ', process.env.NUM_STEPS);
  console.log('NONCE: ', process.env.NONCE);
  /* eslint-enable no-console */

  const strings = stdout.split(',').sort();
  const divider = Math.ceil(strings.length / 6);
  const tests = strings
    .slice(
      Number(process.env.STEP) * divider,
      (Number(process.env.STEP) + 1) * divider,
    )
    .join(',');

  runCommand(
    `CYPRESS_BASE_URL=http://vets-website:3001 CYPRESS_CI=${
      process.env.CI
    } XDG_CONFIG_HOME=/tmp/cyhome${
      process.env.STEP
    } yarn cy:run --config video=false --spec '${tests}'`,
  );
});
