const E2eHelpers = require('../../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');
const institutionProfile = require('../data/institution-profile.json');

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
  GiHelpers.searchForInstitution(client);

  // Search Page
  GiHelpers.expectLocation(
    client,
    `/search?category=school&name=${institutionAttributes.name.replace(
      /\s/g,
      '+',
    )}`,
  );
  GiHelpers.selectFirstSearchResult(client);

  // Profile Page
  GiHelpers.expectLocation(
    client,
    `/profile/${institutionAttributes.facility_code}`,
  );
  client
    .waitForElementVisible('.profile-page', Timeouts.normal)
    .axeCheck('.main'); // commented out until 7727 is fixed

  GiHelpers.displayLearnMoreModal(client);

  // Estimate your benefits
  GiHelpers.expandCollapseMainSection(client, 'Estimate your benefits');
  GiHelpers.editEligibilityDetails(client);
  GiHelpers.hideCalculatorFields(client);

  // Veteran programs
  GiHelpers.expandCollapseMainSection(client, 'Veteran programs');

  // School locations
  GiHelpers.expandCollapseMainSection(client, 'School locations');

  // Cautionary information
  GiHelpers.expandCollapseMainSection(client, 'Cautionary information');

  // Contact details
  GiHelpers.expandCollapseMainSection(client, 'Contact details');

  // Additional information
  GiHelpers.expandCollapseMainSection(client, 'Additional information');

  client.end();
});
