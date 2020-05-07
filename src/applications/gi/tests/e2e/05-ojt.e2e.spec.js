const E2eHelpers = require('platform/testing/e2e/helpers');
const Timeouts = require('platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');
const OjtHelpers = require('./ojt-helpers');
const ojtProfile = require('../data/ojt-profile.json');
const ojtSearchResults = require('../data/ojt-search-results.json');

/**
 * Default OJT profile flow with giBillChapter chapter 33
 * @type {{"Begin application": function(*=): void}|{"Begin application": function(*=): void}}
 */
module.exports = E2eHelpers.createE2eTest(client => {
  const ojtAttributes = ojtProfile.data.attributes;

  GiHelpers.initApplicationMock(ojtProfile, ojtSearchResults);

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  E2eHelpers.overrideSmoothScrolling(client);
  client.timeoutsAsyncScript(2000);

  // Landing Page
  client
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');
  OjtHelpers.selectOJTType(client);
  GiHelpers.searchForInstitution(client, ojtAttributes.name);

  // Search Page
  GiHelpers.verifySearchResults(client, ojtSearchResults);
  GiHelpers.expectLocation(
    client,
    `/search?category=employer&name=${ojtAttributes.name.replace(/\s/g, '+')}`,
  );
  GiHelpers.selectSearchResult(client, ojtAttributes.facility_code);

  // Profile Page

  // Estimate your benefits
  GiHelpers.expandCollapseAccordion(client, 'Estimate your benefits');
  OjtHelpers.yourBenefits(client);
  OjtHelpers.learningFormatAndSchedule(client);
  OjtHelpers.scholarshipsAndOtherFunding(client);

  // Cautionary information
  GiHelpers.expandCollapseAccordion(client, 'Cautionary information');

  // Contact details
  GiHelpers.expandCollapseAccordion(client, 'Contact details');

  // Additional information
  GiHelpers.expandCollapseAccordion(client, 'Additional information');

  client.end();
});
