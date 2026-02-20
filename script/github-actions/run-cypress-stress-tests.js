const fs = require('fs');
const path = require('path');
const { runCommandSync } = require('../utils');

const tests = fs.existsSync(path.resolve(`e2e_tests_to_stress_test.json`))
  ? JSON.parse(fs.readFileSync(path.resolve(`e2e_tests_to_stress_test.json`)))
  : null;

const status = runCommandSync(
  `yarn cy:run --quiet --browser chrome --headless --reporter cypress-multi-reporters --reporter-options "configFile=config/cypress-reporters.js" --spec '${tests}'`,
);

process.exit(status);
