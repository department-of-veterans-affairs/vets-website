const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');
const VetTecHelpers = require('./vet-tec-helpers');
const vetTecSearchResults = require('../data/vet-tec-search-results.json');

module.exports = E2eHelpers.createE2eTest(client => {
  const vetTecAttributes = vetTecSearchResults.data[0].attributes;

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
  GiHelpers.selectSearchResult(
    client,
    GiHelpers.createId(
      `${vetTecAttributes.facility_code}-${vetTecAttributes.description}`,
    ),
  );

  // Profile Page
  client
    .waitForElementVisible('.profile-page', Timeouts.normal)
    .axeCheck('.main'); // commented out until 7727 is fixed
  GiHelpers.expectLocation(
    client,
    `/profile/${vetTecAttributes.facility_code}/`,
  );

  GiHelpers.displayLearnMoreModal(client);

  // Approved programs
  GiHelpers.expandCollapseAccordion(client, 'Approved programs');

  // Estimate your benefits
  GiHelpers.expandCollapseAccordion(client, 'Estimate your benefits');

  // Veteran programs
  GiHelpers.expandCollapseAccordion(client, 'Veteran programs');

  // Application process
  GiHelpers.expandCollapseAccordion(client, 'Application process');

  // Contact details
  GiHelpers.expandCollapseAccordion(client, 'Contact details');

  // Additional information
  GiHelpers.expandCollapseAccordion(client, 'Additional information');

  client.end();
});
