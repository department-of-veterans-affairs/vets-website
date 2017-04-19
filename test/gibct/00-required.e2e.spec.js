const E2eHelpers = require('../e2e/e2e-helpers');
const Timeouts = require('../e2e/timeouts.js');
const GiHelpers = require('../e2e/gibct-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    GiHelpers.initApplicationMock();

    client
      .url(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

    E2eHelpers.overrideSmoothScrolling(client);
    client.timeoutsAsyncScript(2000);

    client
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('.gi-app', Timeouts.slow)
      .axeCheck('.main');

    client
      .clearValue('.keyword-search input[type="text"]')
      .setValue('.keyword-search input[type="text"]', 'washington dc');

    client
      .click('#search-button')
      .waitForElementVisible('.search-page', Timeouts.normal)
      .axeCheck('.main');

    client
      .click('.search-result a')
      .waitForElementVisible('.profile-page', Timeouts.normal)
      .axeCheck('.main');

    client.end();
  }
);
