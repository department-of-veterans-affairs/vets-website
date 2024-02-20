import 'cypress-real-events';

// This is the timeout duration between each event. You can overwrite this in your test if you want it to move faster or slower.
// eslint-disable-next-line prefer-const
let timeoutDuration = 0;

// Utility to remove ID selector (in case it's included)
const leadingHashRegex = /^#/;
const removeLeadingHash = name => name.replace(leadingHashRegex, '');

/**
 * This command is used by other commands to select form values. You can call this yourself if you want to move focus to a specific radio value while the radio field is focused. The value is the value of the input/option.
 */
// NOTE: This method does not work within <select> elements.
// See https://github.com/dmtrKovalenko/cypress-real-events/issues/25
// See https://github.com/department-of-veterans-affairs/va.gov-team/issues/16413#issuecomment-1093123322
// Use chooseSelectOptionUsingValue or chooseSelectOptionByTyping instead.
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
 * @callback chooseSelectOptionUsingValue
 * @param {String} value - The option value to search for
 */
/**
 * This command will target the focused select and then find and select the option value (not text, like `chooseSelectOptionByTyping`) that matches, and then selects it
 * @param {String} name - Name of the new command
 * @param {chooseSelectOptionUsingValue} callbackFunction - The callback that uses the value to find the matching option, and then selects it by typing (because Arrow down does not work on Mac)
 */
Cypress.Commands.add('chooseSelectOptionUsingValue', value => {
  cy.get(':focus')
    .find('option')
    .each($option => {
      if (value === $option[0].value) {
        cy.findSelectOptionByTyping($option.text());
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

// Tab to element and press the space bar.
Cypress.Commands.add(
  'tabToElementAndPressSpace',
  (selector, forward = true) => {
    cy.tabToElement(selector, forward);
    cy.realPress('Space');
  },
);

// Target & use the "Start" form button on the Introduction page
Cypress.Commands.add('tabToStartForm', () => {
  // Same button selector as tabToSubmitForm, or action link
  const buttonSelector = "a[href='#start']";
  cy.get(buttonSelector, { timeout: 10000 }).then(button => {
    if (button[0].tagName === 'VA-BUTTON') {
      cy.get('va-button')
        .first()
        .shadow()
        .find('button')
        .focus();
    } else {
      cy.tabToElement(
        'button[id$="continueButton"].usa-button-primary, .vads-c-action-link--green',
      );
    }
    cy.realPress('Enter');
  });
});

// Target & use the "Continue" button on a form page
Cypress.Commands.add('tabToContinueForm', () => {
  cy.tabToElement('button[type="submit"]');
  cy.realPress('Space');
});

// Target & use the "Continue" button on a form page wit a simulated {enter}
// press
Cypress.Commands.add('tabToContinueFormSimulatedEnter', () => {
  cy.tabToElement('button[type="submit"]');
  cy.get(':focus').type('{enter}');
});

// Target & use the "Back" form button on a form page
Cypress.Commands.add('tabToGoBack', (forward = true) => {
  cy.tabToElement('#1-continueButton', forward);
  cy.get(':focus').type('{enter}');
});

// Target & use the "Submit" form button on the review & submit page
Cypress.Commands.add('tabToSubmitForm', () => {
  // Form submit button is a button type?
  cy.tabToElement('button[id$="continueButton"].usa-button-primary');
  cy.realPress('Space');
});

/**
 * @callback tabToInputWithLabel
 * @param {String} - Text within a label associated with an input you want to focus
 */
/**
 * This command allows you to search for an input using the label text. The focus will be moved to that element, if the label text is found. Modified from Cypress docs: https://glebbahmutov.com/cypress-examples/6.5.0/recipes/form-input-by-label.html#reusable-function
 * @param {String} name - Name of the new command
 * @param {tabToInputWithLabel} callbackFunction - The callback finds the label text and then focuses on the associated input
 */
// TODO: This doesn't actually mimic the actions of a keyboard user. Need to
// update this method or deprecate it.
Cypress.Commands.add('tabToInputWithLabel', text => {
  cy.contains('label', text)
    .invoke('attr', 'for')
    .then(id => {
      cy.tabToElement(`#${id}`);
    });
});

/**
 * @callback typeInIfDataExists
 * @param {String} selector - The CSS element selector
 * @param {String} text - Text to type into focused element
 */
/**
 * This command will check if the data value is truthy, before tabbing to the element. If found, it will then type in the focused element
 * @param {String} name - Name of the new command
 * @param {typeInIfDataExists} callbackFunction - The callback that handles moving the focus to an element and then typing in the text
 */
Cypress.Commands.add('typeInIfDataExists', (selector, text) => {
  if (text) {
    cy.tabToElement(selector);
    cy.typeInFocused(text);
  }
});

/**
 * @callback setCheckboxFromData
 * @param {String} selector - The CSS element selector
 * @param {Boolean} isChecked=false - checkbox state
 */
/**
 * This command will find and check a checkbox if the data is true
 * @param {String} name - Name of the new command
 * @param {setCheckboxFromData} callbackFunction - The callback that handles focusing & checking or unchecking a checkbox based on the checkbox state
 */
Cypress.Commands.add('setCheckboxFromData', (selector, isChecked = false) => {
  cy.tabToElement(selector).then($el => {
    if ($el[0].checked !== isChecked) {
      cy.realPress('Space');
    }
  });
});

/**
 * FullName
 * @typedef {Object}
 * @property {String} prefix - Prefix
 * @property {String} first - First name
 * @property {String} middle - Middle name
 * @property {String} last - Last name
 * @property {String} suffix - Suffix
 */
/**
 * @callback typeInFullName
 * @param {String} fieldName - The group of elements ID prefix
 * @param {FullName} data - Full name object
 */
/**
 * This command will check if the data portion of the value is truthy, before tabbing to the name part. If found, it will then select or type in the name part
 * @param {String} name - Name of the new command
 * @param {typeInFullName} callbackFunction - The callback that handles moving the focus to an element and then select or type in the text
 */
Cypress.Commands.add('typeInFullName', (fieldName, data) => {
  const name = removeLeadingHash(fieldName);
  if (data.prefix) {
    cy.tabToElement(`#${name}prefix`);
    cy.chooseSelectOptionByTyping(data.prefix);
  }
  cy.typeInIfDataExists(`#${name}first`, data.first);
  cy.typeInIfDataExists(`#${name}middle`, data.middle);
  cy.typeInIfDataExists(`#${name}last`, data.last);
  if (data.suffix) {
    cy.tabToElement(`#${name}suffix`);
    cy.chooseSelectOptionByTyping(data.suffix);
  }
});

/**
 * @callback typeInDate
 * @param {String} fieldName - The group of elements ID prefix
 * @param {String} dateString - Date string in "YYYY-MM-DD" format
 */
/**
 * This command will select the date in a month & day select and then type in the year into a text input
 * @param {String} name - Name of the new command
 * @param {typeInDate} callbackFunction - The callback that handles making the month & day selections and typing in the year
 */
Cypress.Commands.add('typeInDate', (fieldName, dateString) => {
  // Remove leading zeros
  const date = dateString.split('-').map(v => parseInt(v, 10).toString());
  const name = removeLeadingHash(fieldName);
  cy.tabToElement(`#${name}Month`);
  cy.chooseSelectOptionUsingValue(date[1]);
  cy.tabToElement(`#${name}Day`);
  cy.chooseSelectOptionUsingValue(date[2]);
  cy.tabToElement(`input[name="${name}Year"]`);
  cy.typeInFocused(date[0]);
});
