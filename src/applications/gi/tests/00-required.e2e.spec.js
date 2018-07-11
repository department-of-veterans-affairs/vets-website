const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    GiHelpers.initApplicationMock();

    client
      .url(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

    E2eHelpers.overrideSmoothScrolling(client);
    client.timeoutsAsyncScript(2000);

    client
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('.gi-app', Timeouts.slow)
      // do not run 'wcag2a' rules because of open aXe bug https://github.com/dequelabs/axe-core/issues/214
      .axeCheck('.main', { rules: ['section508'] });

    client
      .waitForElementVisible('.keyword-search input[type="text"]', Timeouts.normal)
      .clearValue('.keyword-search input[type="text"]')
      .setValue('.keyword-search input[type="text"]', 'washington dc');

    client
      .click('#search-button')
      .waitForElementVisible('.search-page', Timeouts.normal)
      // do not run 'wcag2a' rules because of open aXe bug https://github.com/dequelabs/axe-core/issues/214
      .axeCheck('.main', { rules: ['section508'] });

    client
      .waitForElementVisible('.search-result a', Timeouts.normal)
      .click('.search-result a')
      .waitForElementVisible('.profile-page', Timeouts.normal)
      .axeCheck('.main');

    // Treating hard refreshes of a profile detail page differently.
    // We are appending the Search Results crumb using `searchCount` logic.
    // Hard page refreshes won't have that available, so we shorten the
    // breadcrumb by one on refresh, and assert the list length is 4.
    client
      .refresh()
      .waitForElementVisible('.va-nav-breadcrumbs', Timeouts.normal)
      .waitForElementVisible('.va-nav-breadcrumbs-list', Timeouts.normal)
      .waitForElementVisible('.profile-page', Timeouts.normal);

    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(4) a[aria-current="page"]').to.be.present;
    client.expect.element('.va-nav-breadcrumbs-list li:nth-of-type(4) a[aria-current="page"]').to.have.css('pointer-events').which.equal('none');

    client.end();
  }
);
