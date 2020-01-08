const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  const { ENTER, TAB } = client.Keys;

  GiHelpers.initApplicationMock();

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  E2eHelpers.overrideSmoothScrolling(client);
  client.timeoutsAsyncScript(2000);

  // Assert ALLY.JS array lengths are correct for tabindex="-1"
  client
    .waitForElementVisible('body', Timeouts.normal)
    .waitForElementVisible('.gi-app', Timeouts.verySlow)
    .assert.isAllyDeepEquals('body', true);

  // Assert skip navigation link works correctly
  client.waitForElementVisible('#content', Timeouts.normal);
  client.keys(TAB);
  client.assert.isActiveElement('a.show-on-focus');
  client.keys(ENTER);
  client.keys(TAB);
  client.assert.isActiveElement('.va-nav-breadcrumbs-list > li > a');

  // Move on to the form
  client.keys(TAB);
  client.keys(TAB);
  client.keys(TAB);
  client.assert.isActiveElement('#militaryStatus');

  // Evaluate the military status select menu
  client.evaluateSelectMenu('#militaryStatus', 'Active Duty', 'active duty');
});
