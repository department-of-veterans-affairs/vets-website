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

  GiHelpers.searchAsDEA(client, firstResult);

  GiHelpers.verifyAllDEAojt(client);

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  GiHelpers.searchAsDEA(client, secondResult);

  GiHelpers.verifyDEA(client, 'full', '$1,224/mo');
  GiHelpers.verifyDEA(client, 'three quarters', '$967/mo');
  GiHelpers.verifyDEA(client, 'half', '$710/mo');
  GiHelpers.verifyDEA(client, 'less than half', '$710/mo');
  GiHelpers.verifyDEA(client, 'quarter', '$306/mo');

  client.end();
});
