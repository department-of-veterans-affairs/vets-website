const E2eHelpers = require('../../../testing/e2e/helpers');
const Timeouts = require('../../../testing/e2e/timeouts.js');

module.exports = E2eHelpers.createE2eTest(client => {
  client
    .openUrl(E2eHelpers.baseUrl)
    .waitForElementVisible('body', Timeouts.normal);

  client.end();
});
