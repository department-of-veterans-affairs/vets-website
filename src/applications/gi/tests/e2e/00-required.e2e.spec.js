const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');
const institutionProfile = require('../data/institution-profile.json');

/**
 * Default Institution (none VETTEC or OJT) profile flow with giBillChapter chapter 33
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
  GiHelpers.expandCollapseAccordion(client, 'Estimate your benefits');
  GiHelpers.yourBenefits(client);
  GiHelpers.aboutYourSchool(client);
  GiHelpers.learningFormatAndSchedule(client);
  GiHelpers.scholarshipsAndOtherFunding(client);

  // Veteran programs
  GiHelpers.expandCollapseAccordion(client, 'Veteran programs');

  // School locations
  GiHelpers.expandCollapseAccordion(client, 'School locations');

  // Cautionary information
  GiHelpers.expandCollapseAccordion(client, 'Cautionary information');

  // Contact details
  GiHelpers.expandCollapseAccordion(client, 'Contact details');

  // Additional information
  GiHelpers.expandCollapseAccordion(client, 'Additional information');

  client.end();
});
