const E2eHelpers = require('../../e2e/e2e-helpers');
const Timeouts = require('../../e2e/timeouts.js');

const modalLink = 'button[data-show="#modal-crisisline"]';
const firstModalItem = 'a[href="tel:18002738255"]';
const closeControl = '.va-crisis-panel.va-modal-inner button';
const lastModalItem = 'a[href="https://www.veteranscrisisline.net/"]';

module.exports = E2eHelpers.createE2eTest(
  (client) => {
    const { TAB, SHIFT } = client.Keys;

    client
      .url(`${E2eHelpers.baseUrl}/`);

    E2eHelpers.overrideSmoothScrolling(client);

    client
      .waitForElementVisible('body', Timeouts.normal)
      .waitForElementVisible(modalLink, Timeouts.slow)
      .axeCheck('.main');


    // --------------------- //
    // --- Modal tests --- //
    // --------------------- //

    // Open modal
    client
      .click(modalLink)
      .assert.isActiveElement(firstModalItem);

    // Trap backward traversall
    client
      .keys([SHIFT, TAB, TAB, SHIFT]) // Second SHIFT releases modifier key
      .assert.isActiveElement(lastModalItem);

    // Trap forward traversal
    client
      .keys(TAB)
      .assert.isActiveElement(closeControl);

    client.end();
  });

