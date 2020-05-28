const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');
const institutionProfile = require('../data/institution-profile.json');

/**
 * PUBLIC Institution profile flow with default input selections
 * @type {{"Begin application": function(*=): void}|{"Begin application": function(*=): void}}
 */
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
  GiHelpers.searchForInstitution(client, institutionAttributes.name);

  // Search Page
  GiHelpers.verifySearchResults(client);
  GiHelpers.expectLocation(
    client,
    `/search?category=school&name=${institutionAttributes.name.replace(
      /\s/g,
      '+',
    )}`,
  );
  GiHelpers.selectSearchResult(client, institutionAttributes.facility_code);

  // Profile Page
  GiHelpers.displayLearnMoreModal(client);

  // Estimate your benefits
  GiHelpers.collapseExpandAccordion(client, 'Estimate your benefits');
  GiHelpers.yourMilitaryDetails(client);
  GiHelpers.schoolCostsAndCalendar(client);
  GiHelpers.learningFormat(client);
  GiHelpers.scholarshipsAndOtherVAFunding(client);

  // Veteran programs
  GiHelpers.collapseExpandAccordion(client, 'Veteran programs');

  // School locations
  GiHelpers.collapseExpandAccordion(client, 'School locations');

  // Cautionary information
  GiHelpers.collapseExpandAccordion(client, 'Cautionary information');

  // Contact details
  GiHelpers.collapseExpandAccordion(client, 'Contact details');

  // Additional information
  GiHelpers.collapseExpandAccordion(client, 'Additional information');

  client.end();
});
