const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');

const firstResult =
  '#react-root > div > div > div > div.search-page > div:nth-child(2) > div.search-results.small-12.usa-width-three-fourths.medium-9.columns.opened > div:nth-child(2) > div:nth-child(1) > div > div > div:nth-child(1) > div.small-12.usa-width-seven-twelfths.medium-7.columns > h2 > a';
const secondResult =
  '#react-root > div > div > div > div.search-page > div:nth-child(2) > div.search-results.small-12.usa-width-three-fourths.medium-9.columns.opened > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div.small-12.usa-width-seven-twelfths.medium-7.columns > h2 > a';

module.exports = E2eHelpers.createE2eTest(client => {
  GiHelpers.initApplicationMock();

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  E2eHelpers.overrideSmoothScrolling(client);
  client.timeoutsAsyncScript(2000);

  client
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.gi-app', Timeouts.slow)
    .axeCheck('.main');

  client
    .waitForElementVisible('#giBillChapter', Timeouts.slow)
    .selectDropdown('giBillChapter', '35');

  client
    .waitForElementVisible(
      '.keyword-search input[type="text"]',
      Timeouts.normal,
    )
    .clearValue('.keyword-search input[type="text"]')
    .setValue('.keyword-search input[type="text"]', 'washington dc');

  client
    .click('#search-button')
    .waitForElementVisible('.search-page', Timeouts.normal)
    .axeCheck('.main');

  client
    .waitForElementVisible(firstResult, Timeouts.normal)
    .click(firstResult)
    .waitForElementVisible('.profile-page', Timeouts.normal)
    .axeCheck('.main');

  GiHelpers.verifyAllDEAojt(client);

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  client
    .waitForElementVisible('#giBillChapter', Timeouts.slow)
    .selectDropdown('giBillChapter', '35');

  client
    .waitForElementVisible(
      '.keyword-search input[type="text"]',
      Timeouts.normal,
    )
    .clearValue('.keyword-search input[type="text"]')
    .setValue('.keyword-search input[type="text"]', 'washington dc');

  client
    .click('#search-button')
    .waitForElementVisible('.search-page', Timeouts.normal)
    .axeCheck('.main');

  client
    .waitForElementVisible(secondResult, Timeouts.slow)
    .pause(1000)
    .click(secondResult)
    .waitForElementVisible('.profile-page', Timeouts.normal)
    .axeCheck('.main');

  GiHelpers.verifyDEA(client, '$1,224/mo');

  client.end();
});
