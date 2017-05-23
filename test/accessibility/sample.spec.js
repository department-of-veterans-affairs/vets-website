const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    client
      .url(E2eHelpers.baseUrl)
      .waitForElementVisible('body', Timeouts.normal)
      .axeCheck('document');

    client.end();
  });
