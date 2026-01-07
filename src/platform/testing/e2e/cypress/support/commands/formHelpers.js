import Timeouts from 'platform/testing/e2e/timeouts';

const FORCE_OPTION = { force: true };

Cypress.Commands.add('fillName', (baseName, name) => {
  cy.get(`input[name="${baseName}_first"]`, {
    timeout: Timeouts.normal,
  }).should('be.visible');
  cy.get(`input[name="${baseName}_first"]`)
    .clear()
    .type(name.first);
  cy.get(`input[name="${baseName}_middle"]`)
    .clear()
    .type(name.middle);
  cy.get(`input[name="${baseName}_last"]`)
    .clear()
    .type(name.last);
  if (name.suffix) {
    cy.get(`select[name="${baseName}_suffix"]`).select(name.suffix);
  }
});
Cypress.Commands.add('fill', (selector, value) => {
  if (typeof value !== 'undefined') {
    cy.get(selector)
      .clear()
      .type(value);
  }
});
Cypress.Commands.add('selectRadio', (fieldName, value) => {
  if (value !== 'undefined') {
    cy.document().then(doc => {
      const attrs = `[name="${fieldName}"][value="${value}"]`;
      const vaRadioOption = doc.querySelector(`va-radio-option${attrs}`);
      if (vaRadioOption) {
        cy.wrap(vaRadioOption).click();
      } else {
        cy.get(`input${attrs}`).click();
      }
    });
  }
});

/**
 * Original React date widget
 */
const reactDate = (fieldName, dateString) => {
  const date = dateString
    .split('-')
    .map(number => parseInt(number, 10).toString());

  cy.get(`#${fieldName}Month`).select(date[1]);
  cy.get(`#${fieldName}Day`).select(date[2]);
  cy.fill(`input[name="${fieldName}Year"]`, date[0]);
};

/**
 * Works with Date widget. And va-date and va-memorable-date web components;
 * expects dateString in YYYY-MM-DD format
 */
Cypress.Commands.add('fillDate', (fieldName, dateString) => {
  cy.document().then(doc => {
    const vaDateElement = doc.querySelector(`va-date[name="${fieldName}"]`);
    const vaMemorableDateElement = doc.querySelector(
      `va-memorable-date[name="${fieldName}"]`,
    );
    if (vaDateElement) {
      const monthYearOnly = !!doc.querySelector(
        `va-date[name="${fieldName}"][monthyearonly]`,
      );
      cy.fillVaDate(vaDateElement, dateString, !!monthYearOnly);
    } else if (vaMemorableDateElement) {
      // USWDS v3 only
      const vaMemorableDateMonthSelect = !!doc.querySelector(
        `va-memorable-date[name="${fieldName}"][monthselect]`,
      );
      cy.fillVaMemorableDate(
        vaMemorableDateElement,
        dateString,
        vaMemorableDateMonthSelect,
      );
    } else {
      reactDate(fieldName, dateString);
    }
  });
});

Cypress.Commands.add('selectYesNo', (fieldName, condition) => {
  const target = `input[id="${fieldName}${condition ? 'Yes' : 'No'}"]`;
  cy.get(target).click();
});
Cypress.Commands.add('clickIf', (selector, condition, ...params) => {
  let shouldClick = !!condition;
  if (typeof condition === 'function') {
    shouldClick = !!condition(...params);
  }
  if (shouldClick) {
    cy.get(selector).click();
  }
});

Cypress.Commands.add('fillAddress', (baseName, address) => {
  if (address.country) {
    cy.get(`#${baseName}_country`)
      .should('exist')
      .then(select => {
        cy.wrap(select).select(address.country);
      });
  }

  if (address.street) {
    cy.fill(`input[name="${baseName}_street"]`, address.street);
  }

  if (address.street2) {
    cy.fill(`input[name="${baseName}_street2"]`, address.street2);
  }

  if (address.city) {
    cy.fill(`input[name="${baseName}_city"]`, address.city);
  }

  if (address.state) {
    cy.get(`#${baseName}_state`).select(address.state);
  }

  if (address.postalCode) {
    cy.fill(`input[name="${baseName}_postalCode"]`, address.postalCode);
  }
});

// Using generic selectors to click on both the continue & submit button;
// because the review page submit button has type="button", and the va-button
// does not have a "continue" or "primary" (default appearance) attribute
Cypress.Commands.add('clickFormContinue', () => {
  cy.get('.form-progress-buttons')
    .find(
      'button.usa-button-primary, va-button[continue], va-button:not([secondary])',
    )
    .then($el => {
      if ($el[0].tagName === 'VA-BUTTON') {
        cy.wrap($el)
          .shadow()
          .find('button')
          .should('be.visible')
          .should('not.be', 'disabled')
          .click(FORCE_OPTION);
      } else {
        cy.wrap($el)
          .should('be.visible')
          .should('not.be', 'disabled')
          .click(FORCE_OPTION);
      }
    });
});

Cypress.Commands.add('clickFormBack', () => {
  cy.get('.form-progress-buttons')
    .find('button.usa-button-secondary, va-button[back]')
    .then($el => {
      if ($el[0].tagName === 'VA-BUTTON') {
        cy.wrap($el)
          .shadow()
          .find('button')
          .should('be.visible')
          .should('not.be', 'disabled')
          .click(FORCE_OPTION);
      } else {
        cy.wrap($el)
          .should('be.visible')
          .should('not.be', 'disabled')
          .click(FORCE_OPTION);
      }
    });
});

Cypress.Commands.add('clickStartForm', () => {
  cy.get(
    'a.schemaform-start-button, a.vads-c-action-link--green[href="#start"], va-link-action[href="#start"]',
  )
    .first()
    .click(FORCE_OPTION);
});
