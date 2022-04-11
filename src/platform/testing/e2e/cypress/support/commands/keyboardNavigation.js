import 'cypress-real-events';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// This is the timeout duration between each event. You can overwrite this in your test if you
// want it to move faster or slower
// eslint-disable-next-line prefer-const
let timeoutDuration = 0;

// This Command is used by other commands to select form values.
// You can call this yourself if you want to move focus to a specific radio or select value
// while the radio or select field is focused. The value is the value of the input/option
Cypress.Commands.add('findOption', value => {
  cy.get(':focus').then($el => {
    if ($el.val() !== value) {
      cy.realPress('ArrowDown', { pressDelay: timeoutDuration });
      cy.findOption(value);
    }
  });
});

Cypress.Commands.add('findSelectOptionByTyping', value => {
  cy.get(':focus :selected').then($el => {
    if ($el.text() !== value) {
      for (const character of value) {
        cy.realPress(character);
      }

      cy.findSelectOptionByTyping(value);
    }
  });
});

// This Command is used to select a specific radio input when one of the radios in a group
// is focused. The value is the value of the input
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

// This Command is used to select a specific select option when a select box is focused.
// The value is the value of the input
Cypress.Commands.add('chooseSelectOptionByTyping', value => {
  if (typeof value === 'undefined') {
    return;
  }

  cy.findSelectOptionByTyping(value);
});

Cypress.Commands.add('chooseSelectOptionByArrow', value => {
  if (typeof value === 'undefined') {
    return;
  }

  cy.findSelectOption(value);
});

// This Command types in the focused input or textarea
Cypress.Commands.add('typeInFocused', text => {
  cy.get(':focus').type(text, { delay: timeoutDuration });
});

// This command tabs to the element on the page based on the passed in selector
// Selector is the selector
// Forward is a boolean that will tab for or backward towards the element
// checkIfExists is for when this Command recursively calls itself, you don't need to call this
Cypress.Commands.add(
  'tabToElem',
  (selector, forward = true, checkIfExists = true) => {
    if (checkIfExists) {
      cy.get(selector).should('exist');
    }

    const key = forward ? 'Tab' : ['Shift', 'Tab'];

    cy.realPress(key, { pressDelay: timeoutDuration }).then(() => {
      cy.get(':focus').then($el => {
        if (!$el.is(selector)) {
          cy.tabToElem(selector, forward, false);
        }
      });
    });
  },
);
