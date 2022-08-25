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
    cy.get(`input[name="${fieldName}"][value="${value}"]`).click();
  }
});
Cypress.Commands.add('fillDate', (fieldName, dateString) => {
  const date = dateString.split('-');
  cy.document().then(doc => {
    const vaDate = doc.querySelector(`va-date[name="${fieldName}"]`);
    if (vaDate) {
      cy.wrap(vaDate)
        .shadow()
        .then(el => {
          cy.wrap(el)
            .find('va-select.select-month')
            .shadow()
            .find('select')
            .select(date[1]);
          cy.wrap(el)
            .find('va-select.select-day')
            .shadow()
            .find('select')
            .select(date[2]);
          cy.wrap(el)
            .find('va-text-input.input-year')
            .shadow()
            .find('input')
            .type(date[0]);
        });
    } else {
      cy.get(`#${fieldName}Month`).select(parseInt(date[1], 10).toString());
      cy.get(`#${fieldName}Day`).select(parseInt(date[2], 10).toString());
      cy.fill(
        `input[name="${fieldName}Year"]`,
        parseInt(date[0], 10).toString(),
      );
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
