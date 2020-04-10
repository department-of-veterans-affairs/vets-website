const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  const institution = GiHelpers.singleSchool.data;

  GiHelpers.initApplicationMock();

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  E2eHelpers.overrideSmoothScrolling(client);
  client.timeoutsAsyncScript(2000);

  // Landing Page
  client
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .axeCheck('.main');

  // Landing Page: Search for an institution
  client
    .waitForElementVisible(
      '.keyword-search input[type="text"]',
      Timeouts.normal,
    )
    .clearValue('.keyword-search input[type="text"]')
    .setValue(
      '.keyword-search input[type="text"]',
      institution.attributes.name,
    );

  // Landing Page: Search
  client.click('#search-button');

  // Search Page
  // E2eHelpers.expectLocation(client, '/search'); doesn't work for some reason
  client
    .waitForElementVisible('.search-page', Timeouts.normal)
    .axeCheck('.main');

  // Search Page: Go to first result
  client
    .waitForElementVisible('.search-result a', Timeouts.normal)
    .click('.search-result a');

  // Profile Page
  E2eHelpers.expectLocation(
    client,
    `/profile/${institution.attributes.facility_code}`,
  );
  client.waitForElementVisible('.profile-page', Timeouts.normal);
  // .axeCheck('.main');

  client.end();
});
