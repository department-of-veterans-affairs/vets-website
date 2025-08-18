import { customButtonGroupContinue } from '../fixtures/helpers';

const fillChecklist = values => {
  values.forEach(value => {
    cy.get(`va-checkbox[name="${value.name}"]`)
      .shadow()
      .find('input')
      .check({ force: true });
  });
};

const fillInputList = values => {
  cy.get('va-text-input')
    .as('InputList')
    .should('have.length', values.length);
  cy.get('@InputList').each((input, index) => {
    cy.wrap(input)
      .find('label')
      .should('contain', values[index].name);
    cy.wrap(input)
      .find('input')
      .should('not.be.disabled')
      .type(values[index].amount);
  });
};

const verifySummaryPage = values => {
  cy.get('[data-testid="mini-summary-card"]').should(
    'have.length',
    values.length,
  );
};

const verifyEditPage = (values, editButtonText) => {
  // get mini summary card list, find edit link in first card and click it
  cy.get('[data-testid="mini-summary-card"]')
    .first()
    .find('a')
    .click();

  // get input fields in edit page
  cy.get('va-text-input')
    .first()
    .shadow()
    .find('input')
    .as('TextInput');
  cy.get('va-text-input')
    .last()
    .shadow()
    .find('input')
    .as('ValueInput');

  // ensure inputs are enabled before interacting
  cy.get('@TextInput').should('not.be.disabled');
  cy.get('@ValueInput').should('not.be.disabled');

  // verify edit page has correct values populated in input fields
  cy.get('@TextInput').should('have.value', values[0].name);
  cy.get('@ValueInput').should('have.value', values[0].amount);

  // edit the values
  cy.get('@TextInput').clear();
  cy.get('@TextInput').type('edit-test');

  cy.get('@ValueInput').clear();
  cy.get('@ValueInput').type('111');

  // return to summary page
  customButtonGroupContinue(editButtonText);

  // verify summary page has card with new value
  cy.get('[data-testid="mini-summary-card"]')
    .first()
    .as('FirstCard');
  cy.get('@FirstCard')
    .find('h4')
    .should('contain', 'edit-test');
  cy.get('@FirstCard').should('contain', '$111.00');
};

const verifyAddPage = (values, editButtonText) => {
  // find add link on mini summary page
  cy.findByTestId('add-link').click();

  // verify edit page has correct values populated in input fields
  cy.get('va-text-input')
    .first()
    .shadow()
    .find('input')
    .should('not.be.disabled')
    .type('add-test');
  cy.get('va-text-input')
    .last()
    .shadow()
    .find('input')
    .should('not.be.disabled')
    .type('1234');

  // return to summary page
  customButtonGroupContinue(editButtonText);

  // verify summary page has card with new value
  cy.get('[data-testid="mini-summary-card"]').should(
    'have.length',
    values.length + 1,
  );
  cy.get('[data-testid="mini-summary-card"]')
    .last()
    .find('h4')
    .should('contain', 'add-test');
  cy.get('[data-testid="mini-summary-card"]')
    .last()
    .should('contain', '$1,234.00');
};

export {
  fillChecklist,
  fillInputList,
  verifySummaryPage,
  verifyEditPage,
  verifyAddPage,
};
