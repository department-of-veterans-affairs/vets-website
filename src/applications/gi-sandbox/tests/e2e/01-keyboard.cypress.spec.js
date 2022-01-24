import { initApplicationMock } from './cypress-helpers';
import { mockTogglesResponse } from './mock-feature_toggles';

describe.skip('GI Keyboard Test', () => {
  it('Behaves as expected when a keyboard is used for interaction', () => {
    initApplicationMock();
    cy.intercept('GET', '/v0/feature_toggles*', mockTogglesResponse);
    cy.visit('/gi-bill-comparison-tool/');

    // Assert the correct number of focusable elements in the form
    cy.hasFocusableCount('div.usa-width-two-thirds form', 14);

    // Assert the correct number of tabbable elements in the form
    cy.hasTabbableCount('div.usa-width-two-thirds form', 11);

    // Assert skip navigation link works correctly
    cy.get('.landing-page').should('be.visible');
    cy.realPress('Tab');
    cy.realPress('Enter');
    cy.repeatKey('Tab', 10);
    cy.get('a.show-on-focus').should('be.focused');
    cy.realPress('Enter');
    cy.repeatKey(['Shift', 'Tab'], 2);
    cy.get('.va-nav-breadcrumbs-list > li > a').should('be.focused');

    // Move on to the form
    cy.repeatKey('Tab', 2);
    cy.get('#militaryStatus').should('be.focused');

    // Evaluate the military status select menu
    cy.allyEvaluateSelectMenu('#militaryStatus', 'child', 'Child');

    // Open and close the GI Bill Benefit modal
    cy.realPress('Tab');
    cy.allyEvaluateModalWindow(
      'button[aria-label="Learn more about VA education and training programs"]',
      'div[role="alertdialog"]',
      'button[aria-label="Close this modal"]',
    );

    // Evaluate the GI Bill Benefit select
    cy.realPress('Tab');
    cy.get('#giBillChapter').should('be.focused');
    cy.allyEvaluateSelectMenu('#giBillChapter', 'montgomery', '30');

    // Open and close the enlistment modal
    cy.realPress('Tab');
    cy.allyEvaluateModalWindow(
      'button[aria-label="Learn more about how the length of Montgomery GI Bill active-duty service affects your benefits"]',
      'div[role="alertdialog"]',
      'button[aria-label="Close this modal"]',
    );

    // Evaluate the enlistment select
    cy.realPress('Tab');
    cy.get('#enlistmentService');
    cy.allyEvaluateSelectMenu('#enlistmentService', '2', '2');

    // Evaluate the type of institution radio group with ARROW_DOWN and ARROW_RIGHT
    cy.realPress('Tab');
    cy.allyEvaluateRadioButtons(
      [
        '.form-radio-buttons  input[name="category"][id^="radio-buttons-"][id$="-0"]',
        '.form-radio-buttons  input[name="category"][id^="radio-buttons-"][id$="-1"]',
      ],
      'ArrowDown',
    );
    cy.allyEvaluateRadioButtons(
      [
        '.form-radio-buttons  input[name="category"][id^="radio-buttons-"][id$="-0"]',
        '.form-radio-buttons  input[name="category"][id^="radio-buttons-"][id$="-1"]',
      ],
      'ArrowRight',
    );

    // Evaluate the type of institution radio group with ARROW_UP and ARROW_LEFT in reverse order
    cy.allyEvaluateRadioButtons(
      [
        '.form-radio-buttons  input[name="category"][id^="radio-buttons-"][id$="-0"]',
        '.form-radio-buttons  input[name="category"][id^="radio-buttons-"][id$="-1"]',
      ],
      'ArrowUp',
      true,
    );
    cy.allyEvaluateRadioButtons(
      [
        '.form-radio-buttons  input[name="category"][id^="radio-buttons-"][id$="-0"]',
        '.form-radio-buttons  input[name="category"][id^="radio-buttons-"][id$="-1"]',
      ],
      'ArrowLeft',
      true,
    );

    // Skip the modal and evaluate the type of class radio group with ARROW_DOWN and ARROW_RIGHT.
    // This one is a bit unique because the second radio is pre-checked.
    cy.repeatKey('Tab', 2);
    cy.allyEvaluateRadioButtons(
      [
        '.form-radio-buttons  input[name="onlineClasses"][id^="radio-buttons-"][id$="-0"]',
        '.form-radio-buttons  input[name="onlineClasses"][id^="radio-buttons-"][id$="-1"]',
      ],
      'ArrowDown',
    );
    cy.allyEvaluateRadioButtons(
      [
        '.form-radio-buttons  input[name="onlineClasses"][id^="radio-buttons-"][id$="-0"]',
        '.form-radio-buttons  input[name="onlineClasses"][id^="radio-buttons-"][id$="-1"]',
      ],
      'ArrowRight',
    );

    // Evaluate the type of class radio group with ARROW_UP and ARROW_LEFT in reverse order
    cy.allyEvaluateRadioButtons(
      [
        '.form-radio-buttons  input[name="onlineClasses"][id^="radio-buttons-"][id$="-0"]',
        '.form-radio-buttons  input[name="onlineClasses"][id^="radio-buttons-"][id$="-1"]',
      ],
      'ArrowUp',
      true,
    );
    cy.allyEvaluateRadioButtons(
      [
        '.form-radio-buttons  input[name="onlineClasses"][id^="radio-buttons-"][id$="-0"]',
        '.form-radio-buttons  input[name="onlineClasses"][id^="radio-buttons-"][id$="-1"]',
      ],
      'ArrowLeft',
      true,
    );

    // Let's try to submit an incomplete form by skipping over the city typeahead
    cy.repeatKey('Tab', 2);
    cy.get('#search-button').should('not.be.disabled');
    cy.get('#search-button').should('be.focused');
    cy.realPress('Enter');

    // An error should appear on the enter a city, school or name typeahead label
    cy.get('#search-error-message').should('exist');
  });
});
