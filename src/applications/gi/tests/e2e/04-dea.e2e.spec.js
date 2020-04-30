const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');
const DeaHelpers = require('./dea-helpers');
const institutionProfile = require('../data/institution-profile.json');

const firstResultRate =
  '#react-root > div > div > div > div.search-page > div > div.row > div.search-results.small-12.usa-width-three-fourths.medium-9.columns.opened > div:nth-child(2) > div:nth-child(1) > div > div > div:nth-child(1) > div.small-12.usa-width-five-twelfths.medium-5.columns.estimated-benefits > div:nth-child(3) > div > h4 > div';

const deaEnrolledMax = 30;

module.exports = E2eHelpers.createE2eTest(client => {
  const institutionAttributes = institutionProfile.data.attributes;

  GiHelpers.initApplicationMock();

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  E2eHelpers.overrideSmoothScrolling(client);
  client.timeoutsAsyncScript(2000);

  // Landing Page
  client
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');

  DeaHelpers.searchAsDEA(client, institutionAttributes);

  // Search Page
  DeaHelpers.verifySearchResults(
    client,
    institutionAttributes.facility_code,
    firstResultRate,
    GiHelpers.formatCurrency(GiHelpers.calculatorConstantsList.DEARATEOJT),
  );
  GiHelpers.selectSearchResult(client, institutionAttributes.facility_code);

  // Loops through all "Enrolled" options for an ojt facility and verifies the DEA housing rate
  for (let i = 2; i <= deaEnrolledMax; i += 2) {
    client.expect
      .element(GiHelpers.housingRate)
      .to.be.enabled.before(Timeouts.normal);
    client.selectDropdown('working', i);
    const value = Math.round(
      (i / deaEnrolledMax) *
        GiHelpers.formatNumber(GiHelpers.calculatorConstantsList.DEARATEOJT),
    );
    client.assert.containsText(GiHelpers.housingRate, `$${value}/mo`);
  }

  // client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`); // use breadcrumb ?

  // DeaHelpers.searchAsDEA(
  //   client,
  //   secondResult,
  //   secondResultRate,
  //   GiHelpers.formatCurrency(GiHelpers.calculatorConstantsList.DEARATEFULLTIME),
  // );
  //
  // DeaHelpers.verifyDEA(
  //   client,
  //   'full',
  //   `${GiHelpers.formatCurrency(
  //     GiHelpers.calculatorConstantsList.DEARATEFULLTIME,
  //   )}/mo`,
  // );
  // DeaHelpers.verifyDEA(
  //   client,
  //   'three quarters',
  //   `${GiHelpers.formatCurrency(
  //     GiHelpers.calculatorConstantsList.DEARATETHREEQUARTERS,
  //   )}/mo`,
  // );
  // DeaHelpers.verifyDEA(
  //   client,
  //   'half',
  //   `${GiHelpers.formatCurrency(
  //     GiHelpers.calculatorConstantsList.DEARATEONEHALF,
  //   )}/mo`,
  // );
  // DeaHelpers.verifyDEA(
  //   client,
  //   'less than half',
  //   `${GiHelpers.formatCurrency(
  //     GiHelpers.calculatorConstantsList.DEARATEUPTOONEHALF,
  //   )}/mo`,
  // );
  // DeaHelpers.verifyDEA(
  //   client,
  //   'quarter',
  //   `${GiHelpers.formatCurrency(
  //     GiHelpers.calculatorConstantsList.DEARATEUPTOONEQUARTER,
  //   )}/mo`,
  // );

  client.end();
});
