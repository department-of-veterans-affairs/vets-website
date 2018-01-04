const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');

const exploreButton = '#vetnav-menu button[aria-controls="vetnav-explore"]';

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    client
      .url(`${E2eHelpers.baseUrl}/`);

    E2eHelpers.overrideSmoothScrolling(client);

    // landing page
    client
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible('#vetnav', Timeouts.slow)
      // do not run 'wcag2a' rules because of open aXe bug https://github.com/dequelabs/axe-core/issues/214
      .axeCheck('.main');


    // --------------------- //
    // --- Menubar tests --- //
    // --------------------- //


    // Down arrow should open menu
    client
      .focusOn(exploreButton)
      .assert.isActiveElement(exploreButton);

    // Up arrow should


    client.end();
  });

