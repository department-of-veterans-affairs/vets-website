const E2eHelpers = require('../util/e2e-helpers');
const Timeouts = require('../util/timeouts.js');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    client
      .url(E2eHelpers.baseUrl)
      .waitForElementVisible('body', Timeouts.normal)
      .attestCheck('document');

    client.end();
  });
