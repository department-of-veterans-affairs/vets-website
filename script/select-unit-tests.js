const glob = require('glob');
const core = require('@actions/core');

const unitTests = glob.sync('src/**/*.unit.spec.js');

core.exportVariable('UNIT_SPECS', JSON.stringify(unitTests));
