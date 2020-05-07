const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');
const DeaHelpers = require('./dea-helpers');
// const institutionProfile = require('../data/institution-profile.json');
const ojtProfile = require('../data/ojt-profile.json');

// const institutionAttributes = institutionProfile.data.attributes;
const ojtAttributes = ojtProfile.data.attributes;

/**
 * OJT and none VETTEC institution profile flow with giBillChapter chapter 35 (DEA)
 * @type {{"Begin application": function(*=): void}|{"Begin application": function(*=): void}}
 */
module.exports = E2eHelpers.createE2eTest(client => {
  DeaHelpers.initApplicationMock();

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  E2eHelpers.overrideSmoothScrolling(client);
  client.timeoutsAsyncScript(2000);

  // Landing Page
  client
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');

  DeaHelpers.searchAsDEA(client);

  // Search Page
  DeaHelpers.verifySearchResults(client);
  GiHelpers.expectLocation(
    client,
    `/search?category=ALL&name=${DeaHelpers.searchString}`,
  );
  GiHelpers.selectSearchResult(client, ojtAttributes.facility_code);

  // OJT Profile Page

  DeaHelpers.yourBenefits(client);
  DeaHelpers.learningFormatAndSchedule(client);

  // client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`); // use breadcrumb ?

  // DeaHelpers.searchAsDEA(
  //   client,
  //   secondResult,
  //   secondResultRate,
  //   GiHelpers.formatCurrency(GiHelpers.calculatorConstants.DEARATEFULLTIME),
  // );
  //
  // DeaHelpers.verifyDEA(
  //   client,
  //   'full',
  //   `${GiHelpers.formatCurrency(
  //     GiHelpers.calculatorConstants.DEARATEFULLTIME,
  //   )}/mo`,
  // );
  // DeaHelpers.verifyDEA(
  //   client,
  //   'three quarters',
  //   `${GiHelpers.formatCurrency(
  //     GiHelpers.calculatorConstants.DEARATETHREEQUARTERS,
  //   )}/mo`,
  // );
  // DeaHelpers.verifyDEA(
  //   client,
  //   'half',
  //   `${GiHelpers.formatCurrency(
  //     GiHelpers.calculatorConstants.DEARATEONEHALF,
  //   )}/mo`,
  // );
  // DeaHelpers.verifyDEA(
  //   client,
  //   'less than half',
  //   `${GiHelpers.formatCurrency(
  //     GiHelpers.calculatorConstants.DEARATEUPTOONEHALF,
  //   )}/mo`,
  // );
  // DeaHelpers.verifyDEA(
  //   client,
  //   'quarter',
  //   `${GiHelpers.formatCurrency(
  //     GiHelpers.calculatorConstants.DEARATEUPTOONEQUARTER,
  //   )}/mo`,
  // );

  client.end();
});
