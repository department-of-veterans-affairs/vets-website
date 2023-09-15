import Timeouts from 'platform/testing/e2e/timeouts';

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
const reactDate = (fieldName, date) => {
  cy.get(`#${fieldName}Month`).select(date[1]);
  cy.get(`#${fieldName}Day`).select(date[2]);
  cy.fill(`input[name="${fieldName}Year"]`, date[0]);
};

const vaDate = (element, monthYearOnly, date) => {
  cy.wrap(element)
    .shadow()
    .then(el => {
      cy.wrap(el)
        .find('va-select.select-month')
        .shadow()
        .find('select')
        .select(date[1]);
      if (!monthYearOnly) {
        cy.wrap(el)
          .find('va-select.select-day')
          .shadow()
          .find('select')
          .select(date[2]);
      }
      cy.wrap(el)
        .find('va-text-input.input-year')
        .shadow()
        .find('input')
        .type(date[0]);
    });
};

const vaMemorableDate = (element, vaMemorableDateMonthSelect, date) => {
  cy.wrap(element)
    .shadow()
    .then(el => {
      // There is a bug only on Chromium based browsers where
      // VaMemorableDate text input fields will think they are
      // disabled if you blur focus of the window while the test
      // is running. realPress and realType solve this issue,
      // but these are only available for Chromium based browsers.
      // See cypress-real-events npmjs for more info.
      // ** see applications/simple-forms/shared/tests/e2e/helpers.js **
      const isChrome = navigator.userAgent.includes('Chrome');
      const getSelectors = type =>
        `va-text-input.input-${type}, va-text-input.usa-form-group--${type}-input`;

      if (vaMemorableDateMonthSelect) {
        cy.wrap(el)
          .find('va-select.usa-form-group--month-select')
          .shadow()
          .find('select')
          .focus();
        cy.select(date[1]);
      } else if (isChrome) {
        cy.wrap(el)
          .find(getSelectors('month'))
          .shadow()
          .find('input')
          .focus();
        cy.realType(date[1]);
      } else {
        cy.wrap(el)
          .find(getSelectors('month'))
          .shadow()
          .find('input')
          .type(date[1]);
      }
      if (isChrome) {
        cy.realPress('Tab')
          .realType(date[2])
          .realPress('Tab')
          .realType(date[0]);
      } else {
        cy.wrap(el)
          .find(getSelectors('day'))
          .shadow()
          .find('input')
          .type(date[2]);
        cy.wrap(el)
          .find(getSelectors('year'))
          .shadow()
          .find('input')
          .type(date[0]);
      }
    });
};

/**
 * Works with Date widget. And va-date and va-memorable-date web components;
 * expects dateString in YYYY-MM-DD format
 */
Cypress.Commands.add('fillDate', (fieldName, dateString) => {
  // Split the date & remove leading zeros
  const date = dateString
    .split('-')
    .map(number => parseInt(number, 10).toString());
  cy.document().then(doc => {
    const vaDateElement = doc.querySelector(`va-date[name="${fieldName}"]`);
    const vaMemorableDateElement = doc.querySelector(
      `va-memorable-date[name="${fieldName}"]`,
    );
    if (vaDateElement) {
      const monthYearOnly = !!doc.querySelector(
        `va-date[name="${fieldName}"][monthyearonly]`,
      );
      vaDate(vaDateElement, !!monthYearOnly, date);
    } else if (vaMemorableDateElement) {
      // USWDS v3 only
      const vaMemorableDateMonthSelect = !!doc.querySelector(
        `va-memorable-date[name="${fieldName}"][monthselect]`,
      );
      vaMemorableDate(vaMemorableDateElement, vaMemorableDateMonthSelect, date);
    } else {
      reactDate(fieldName, date);
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
