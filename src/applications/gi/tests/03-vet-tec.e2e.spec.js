const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');
const VetTecHelpers = require('./vet-tec-helpers');
const vetTecProfile = require('./e2e/vet-tec-profile.json');

module.exports = E2eHelpers.createE2eTest(client => {
  const vetTecAttributes = vetTecProfile.data.attributes;

  VetTecHelpers.initApplicationMock();

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  E2eHelpers.overrideSmoothScrolling(client);
  client.timeoutsAsyncScript(2000);

  // Landing Page
  client
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');

  VetTecHelpers.searchForVetTec(client);

  // Search Page
  GiHelpers.expectLocation(client, `/program-search`);
  GiHelpers.selectFirstSearchResult(client);

  // Profile Page
  GiHelpers.expectLocation(
    client,
    `/profile/${vetTecAttributes.facility_code}/`,
  );
  client
    .waitForElementVisible('.profile-page', Timeouts.normal)
    .axeCheck('.main'); // commented out until 7727 is fixed

  GiHelpers.displayLearnMoreModal(client);

  // Approved programs
  GiHelpers.expandCollapseMainSection(client, 'Approved programs');

  // Estimate your benefits
  GiHelpers.expandCollapseMainSection(client, 'Estimate your benefits');

  // Veteran programs
  GiHelpers.expandCollapseMainSection(client, 'Veteran programs');

  // Application process
  GiHelpers.expandCollapseMainSection(client, 'Application process');

  // Contact details
  GiHelpers.expandCollapseMainSection(client, 'Contact details');

  // Additional information
  GiHelpers.expandCollapseMainSection(client, 'Additional information');

  client.end();
});
