const E2eHelpers = require('../../../platform/testing/e2e/helpers');
const Timeouts = require('../../../platform/testing/e2e/timeouts');
const GiHelpers = require('./gibct-helpers');

module.exports = E2eHelpers.createE2eTest(client => {
  const {
    ARROW_DOWN,
    ARROW_LEFT,
    ARROW_RIGHT,
    ARROW_UP,
    ENTER,
    TAB,
  } = client.Keys;

  GiHelpers.initApplicationMock();

  client.openUrl(`${E2eHelpers.baseUrl}/gi-bill-comparison-tool/`);

  E2eHelpers.overrideSmoothScrolling(client);
  client.timeoutsAsyncScript(2000);

  // Assert skip navigation link works correctly
  client
    .waitForElementVisible('.landing-page', Timeouts.verySlow)
    .keys(TAB)
    .assert.isActiveElement('a.show-on-focus')
    .keys(ENTER)
    .keys(TAB)
    .assert.isActiveElement('.va-nav-breadcrumbs-list > li > a');

  // Move on to the form
  client
    .keys(TAB)
    .keys(TAB)
    .keys(TAB)
    .assert.isActiveElement('#militaryStatus');

  // Evaluate the military status select menu
  client.evaluateSelectMenu('#militaryStatus', 'Active Duty', 'active duty');

  // Open the GI Bill Benefit modal
  client
    .keys(TAB)
    .assert.isActiveElement(
      'button[aria-label="Learn more about VA education and training programs"]',
    )
    .keys(ENTER)
    .waitForElementVisible('div[role="alertdialog"]', Timeouts.normal)
    .assert.isActiveElement('button[aria-label="Close this modal"]');

  // Close the GI Bill Benefit modal
  client
    .keys(ENTER)
    .assert.isActiveElement(
      'button[aria-label="Learn more about VA education and training programs"]',
    );

  // Evaluate the GI Bill Benefit select
  client
    .keys(TAB)
    .assert.isActiveElement('#giBillChapter')
    .evaluateSelectMenu('#giBillChapter', 'Montgomery GI Bill (Ch 30)', '30');

  // Open the enlistment modal
  client
    .keys(TAB)
    .assert.isActiveElement(
      'button[aria-label="Learn more about how the length of Montgomery GI Bill active-duty service affects your benefits"]',
    )
    .keys(ENTER)
    .waitForElementVisible('div[role="alertdialog"]', Timeouts.normal)
    .assert.isActiveElement('button[aria-label="Close this modal"]');

  // Close the enlistment modal
  client
    .keys(ENTER)
    .assert.isActiveElement(
      'button[aria-label="Learn more about how the length of Montgomery GI Bill active-duty service affects your benefits"]',
    );

  // Evaluate the enlistment select
  client
    .keys(TAB)
    .assert.isActiveElement('#enlistmentService')
    .evaluateSelectMenu('#enlistmentService', '2 or more years', '2');

  // Evaluate the type of institution radio group with ARROW_DOWN and ARROW_RIGHT
  client
    .keys(TAB)
    .evaluateRadioButtons(
      ['input#radio-buttons-3-0', 'input#radio-buttons-3-1'],
      ARROW_DOWN,
    )
    .evaluateRadioButtons(
      ['input#radio-buttons-3-0', 'input#radio-buttons-3-1'],
      ARROW_RIGHT,
    );

  // Evaluate the type of institution radio group with ARROW_UP and ARROW_LEFT in reverse order
  client
    .evaluateRadioButtonsReverse(
      ['input#radio-buttons-3-0', 'input#radio-buttons-3-1'],
      ARROW_UP,
    )
    .evaluateRadioButtonsReverse(
      ['input#radio-buttons-3-0', 'input#radio-buttons-3-1'],
      ARROW_LEFT,
    );

  // Skip the modal and evaluate the type of class radio group with ARROW_DOWN and ARROW_RIGHT.
  // This one is a bit unique because the second radio is pre-checked.
  client
    .keys(TAB)
    .keys(TAB)
    .evaluateRadioButtons(
      ['input#radio-buttons-4-1', 'input#radio-buttons-4-2'],
      ARROW_DOWN,
    )
    .evaluateRadioButtons(
      [
        'input#radio-buttons-4-0',
        'input#radio-buttons-4-1',
        'input#radio-buttons-4-2',
      ],
      ARROW_RIGHT,
    );

  // Evaluate the type of class radio group with ARROW_UP and ARROW_LEFT in reverse order
  client
    .evaluateRadioButtonsReverse(
      [
        'input#radio-buttons-4-0',
        'input#radio-buttons-4-1',
        'input#radio-buttons-4-2',
      ],
      ARROW_UP,
    )
    .evaluateRadioButtonsReverse(
      [
        'input#radio-buttons-4-0',
        'input#radio-buttons-4-1',
        'input#radio-buttons-4-2',
      ],
      ARROW_LEFT,
    );

  // Let's try to submit an incomplete form
  client
    .keys(TAB)
    .keys(TAB)
    .assert.isDisabledElement('#search-button', false)
    .assert.isActiveElement('#search-button')
    .keys(ENTER);

  // An error should appear on the enter a city, school or name typeahead label
  client.assert.elementPresent('#search-error-message');

  client.end();
});
