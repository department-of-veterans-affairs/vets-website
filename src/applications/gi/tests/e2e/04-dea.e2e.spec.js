const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');
const DeaHelpers = require('./dea-helpers');
const institutionProfile = require('../data/institution-profile.json');
const ojtProfile = require('../data/ojt-profile.json');

const institutionAttributes = institutionProfile.data.attributes;
const ojtAttributes = ojtProfile.data.attributes;

/**
 * OJT and non VETTEC institution profile flow with giBillChapter chapter 35 (DEA)
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
  GiHelpers.selectSearchResult(client, ojtAttributes.facility_code);

  // OJT Profile Page
  const eybSections = {
    yourBenefits: 'Your benefits',
    learningFormatAndSchedule: 'Learning format and schedule',
  };
  GiHelpers.yourBenefits(client, eybSections);
  GiHelpers.learningFormatAndSchedule(client, eybSections);
  // TODO: re-enable test.
  // DeaHelpers.willBeWorking(client);

  GiHelpers.breadCrumb(client, '/gi-bill-comparison-tool/');
  DeaHelpers.searchAsDEA(client);

  // Search Page
  DeaHelpers.verifySearchResults(client);
  GiHelpers.selectSearchResult(client, institutionAttributes.facility_code);

  // Profile Page
  GiHelpers.yourBenefits(client);
  GiHelpers.aboutYourSchool(client);
  DeaHelpers.enrolledOld(client);

  client.end();
});
