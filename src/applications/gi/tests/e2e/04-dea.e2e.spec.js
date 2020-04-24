import { calculatorConstantsList } from '../helpers';

const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');

const firstResult =
  '#react-root > div > div > div > div.search-page > div > div.row > div.search-results.small-12.usa-width-three-fourths.medium-9.columns.opened > div:nth-child(2) > div:nth-child(1) > div > div > div:nth-child(1) > div.small-12.usa-width-seven-twelfths.medium-7.columns > h2 > a';
const firstResultRate =
  '#react-root > div > div > div > div.search-page > div > div.row > div.search-results.small-12.usa-width-three-fourths.medium-9.columns.opened > div:nth-child(2) > div:nth-child(1) > div > div > div:nth-child(1) > div.small-12.usa-width-five-twelfths.medium-5.columns.estimated-benefits > div:nth-child(3) > div > h4 > div';
const secondResult =
  '#react-root > div > div > div > div.search-page > div > div.row > div.search-results.small-12.usa-width-three-fourths.medium-9.columns.opened > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div.small-12.usa-width-seven-twelfths.medium-7.columns > h2 > a';
const secondResultRate =
  '#react-root > div > div > div > div.search-page > div > div.row > div.search-results.small-12.usa-width-three-fourths.medium-9.columns.opened > div:nth-child(2) > div:nth-child(2) > div > div > div:nth-child(1) > div.small-12.usa-width-five-twelfths.medium-5.columns.estimated-benefits > div:nth-child(3) > div > h4 > div';

const deaEnrolledMax = 30;
const housingRate =
  '#gbct_housing_allowance > div.small-6.columns.vads-u-text-align--right > h5';

module.exports = E2eHelpers.createE2eTest(client => {
  GiHelpers.initApplicationMock();

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  E2eHelpers.overrideSmoothScrolling(client);
  client.timeoutsAsyncScript(2000);

  client
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');

  GiHelpers.searchAsDEA(
    client,
    firstResult,
    firstResultRate,
    GiHelpers.formatCurrency(calculatorConstantsList.DEARATEOJT),
  );

  // Loops through all "Enrolled" options for an ojt facility and verifies the DEA housing rate
  for (let i = 2; i <= deaEnrolledMax; i += 2) {
    client.expect.element(housingRate).to.be.enabled.before(Timeouts.normal);
    client.selectDropdown('working', i);
    const value = Math.round(
      (i / deaEnrolledMax) *
        GiHelpers.formatNumber(calculatorConstantsList.DEARATEOJT),
    );
    client.assert.containsText(housingRate, `$${value}/mo`);
  }

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  GiHelpers.searchAsDEA(
    client,
    secondResult,
    secondResultRate,
    GiHelpers.formatCurrency(calculatorConstantsList.DEARATEFULLTIME),
  );

  GiHelpers.verifyDEA(
    client,
    'full',
    `${GiHelpers.formatCurrency(calculatorConstantsList.DEARATEFULLTIME)}/mo`,
  );
  GiHelpers.verifyDEA(
    client,
    'three quarters',
    `${GiHelpers.formatCurrency(
      calculatorConstantsList.DEARATETHREEQUARTERS,
    )}/mo`,
  );
  GiHelpers.verifyDEA(
    client,
    'half',
    `${GiHelpers.formatCurrency(calculatorConstantsList.DEARATEONEHALF)}/mo`,
  );
  GiHelpers.verifyDEA(
    client,
    'less than half',
    `${GiHelpers.formatCurrency(
      calculatorConstantsList.DEARATEUPTOONEHALF,
    )}/mo`,
  );
  GiHelpers.verifyDEA(
    client,
    'quarter',
    `${GiHelpers.formatCurrency(
      calculatorConstantsList.DEARATEUPTOONEQUARTER,
    )}/mo`,
  );

  client.end();
});
