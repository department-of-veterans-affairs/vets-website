import 'cypress-real-events';

// This is the timeout duration between each event. You can overwrite this in your test if you want it to move faster or slower.
// eslint-disable-next-line prefer-const
let timeoutDuration = 1;

/**
 * This command is used by other commands to select form values. You can call this yourself if you want to move focus to a specific radio value while the radio field is focused. The value is the value of the input/option.
 */
Cypress.Commands.add('findOption', value => {
  cy.get(':focus').then($el => {
    if ($el.val() !== value) {
      cy.realPress('ArrowDown', { pressDelay: timeoutDuration });
      cy.findOption(value);
    }
  });
});

/**
 * This command is used by other commands to select form values by typing in the desired characters. This is done instead of arrow keys because doing this on Mac is currently not possible. You can call this yourself if you want to move focus to a specific select value while the select field is focused. The text is the text that shows to the user on the select option.
 */
Cypress.Commands.add('findSelectOptionByTyping', text => {
  cy.get(':focus :selected').then($el => {
    if ($el.text() !== text) {
      for (const character of text) {
        cy.realPress(character);
      }

      cy.findSelectOptionByTyping(text);
    }
  });
});

/**
 * This command is used to select a specific radio input when one of the radios in a group is focused. The value is the value of the input.
 */
Cypress.Commands.add('chooseRadio', value => {
  if (typeof value === 'undefined') {
    return;
  }
  cy.get(':focus').then($el => {
    cy.get(`input[name='${$el.attr('name')}'][value='${value}']`).should(
      'exist',
    );
    cy.findOption(value);
    cy.realPress('Space');
  });
});

/**
 * This command is used to select a specific select option when a select box is focused. The value is the value of the input
 */
Cypress.Commands.add('chooseSelectOptionByTyping', text => {
  if (typeof text === 'undefined') {
    return;
  }

  cy.findSelectOptionByTyping(text);
});

/**
 * This command types in the focused input or textarea.
 * */
Cypress.Commands.add('typeInFocused', text => {
  cy.get(':focus').type(text, { delay: timeoutDuration });
});

/**
 * @callback moveToElement
 * @param {String} selector - The CSS element selector.
 * @param {Boolean} [forward=true] - A boolean that will tab for or backward towards the element.
 * @param {Boolean} [checkIfExists=true] - A boolean for when this command recursively calls itself, you don't need to call this
 */

/**
 * This command tabs to the element on the page based on the passed in selector.
 * @param {String} name - Name of the new command.
 * @param {moveToElement} callbackFunction - The callback that handles moving to the element.
 */
Cypress.Commands.add(
  'tabToElement',
  (selector, forward = true, checkIfExists = true) => {
    if (checkIfExists) {
      cy.get(selector).should('exist');
    }

    const key = forward ? 'Tab' : ['Shift', 'Tab'];

    cy.realPress(key, { pressDelay: timeoutDuration }).then(() => {
      cy.get(':focus').then($el => {
        if (!$el.is(selector)) {
          cy.tabToElement(selector, forward, false);
        }
      });
    });
  },
);
