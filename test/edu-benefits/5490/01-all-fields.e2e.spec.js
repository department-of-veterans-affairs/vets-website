const E2eHelpers = require('../../e2e/e2e-helpers');
const runTest = require('./e2e-test.js');

module.exports = E2eHelpers.createE2eTest(
  (client) => runTest(client, false)
);
