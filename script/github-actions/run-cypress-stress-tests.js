const { runCommandSync } = require('../utils');

const tests = JSON.parse(process.env.TESTS);

const status = runCommandSync(
  `CYPRESS_EVERY_NTH_FRAME=1 yarn cy:run --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.js" --spec '${tests}'`,
);

process.exit(status);
