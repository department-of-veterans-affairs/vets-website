const E2eHelpers = require('../../testing/e2e/helpers');

const overlay = '#modal-crisisline';
const firstModalItem = 'a[href="tel:18002738255"]';
const closeControl = '.va-crisis-panel.va-modal-inner button';
const firstOpenControl = 'button.va-crisis-line.va-overlay-trigger';
const secondOpenControl = '.homepage-button.vcl.va-overlay-trigger';
const thirdOpenControl = 'footer .va-button-link.va-overlay-trigger';
const lastModalItem = 'a[href="https://www.veteranscrisisline.net/"]';

module.exports = E2eHelpers.createE2eTest(client => {
  const { ENTER, ESCAPE, TAB, SHIFT } = client.Keys;

  client.openUrl(`${E2eHelpers.baseUrl}/`);

  E2eHelpers.overrideSmoothScrolling(client);

  // --------------------- //
  // --- Modal tests --- //
  // --------------------- //

  // Open modal
  client
    .focusOn(firstOpenControl)
    .keys(ENTER)
    .assert.isActiveElement(firstModalItem);

  // Trap backward traversal
  client
    .keys([SHIFT, TAB, TAB, SHIFT]) // Second SHIFT releases modifier key
    .assert.isActiveElement(lastModalItem);

  // Trap forward traversal
  client.keys(TAB).assert.isActiveElement(closeControl);

  // Escape modal
  client
    .keys(ESCAPE)
    .assert.cssClassNotPresent(overlay, 'va-overlay--open')
    .assert.cssClassNotPresent('body', 'va-pos-fixed');

  // Return focus to appropriate open controls
  client.assert.isActiveElement(firstOpenControl);

  client
    .focusOn(secondOpenControl)
    .keys(ENTER)
    .assert.isActiveElement(firstModalItem);

  client.keys(ESCAPE).assert.isActiveElement(secondOpenControl);

  client
    .focusOn(thirdOpenControl)
    .keys(ENTER)
    .assert.isActiveElement(firstModalItem);

  client.keys(ESCAPE).assert.isActiveElement(thirdOpenControl);

  client.end();
});
