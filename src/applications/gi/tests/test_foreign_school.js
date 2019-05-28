const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  GiHelpers.initApplicationMock();

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  E2eHelpers.overrideSmoothScrolling(client);
  client.timeoutsAsyncScript(2000);

  client
    .waitForElementVisible('body', Timeouts.verySlow)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');

  client
    .waitForElementVisible('body', Timeouts.verySlow)
    .pause(100)
    .axeCheck('.main ');

  client
    .click('#radio-buttons-2-0')
    .pause(100)
    .axeCheck('.main');

  client
    .waitForElementVisible(
      '.keyword-search input[type="text"]',
      Timeouts.normal,
    )
    .clearValue('.keyword-search input[type="text"]')
    .setValue('.keyword-search input[type="text"]', 'DUBLIN CITY UNIVERSITY')
    .pause(100);

  client.click('#search-button').axeCheck('.main');

  client
    .waitForElementVisible('.search-result a', Timeouts.normal)
    .pause(100)
    .click(
      `#react-root > div > div > div > div.search-page > div:nth-child(2) > div.search-results.small-12.usa-width-three-fourths.medium-9.columns.opened > div:nth-child(2) > div:nth-child(3) > div > div > div:nth-child(1) > div.small-12.usa-width-seven-twelfths.medium-7.columns > h2 > a`,
    )
    .waitForElementVisible('.profile-page', Timeouts.verySlow)
    .axeCheck('.main');

  client.end();
});
