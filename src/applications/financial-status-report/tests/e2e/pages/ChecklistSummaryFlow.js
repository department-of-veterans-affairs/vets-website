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

  // verify edit page has correct values populated in input fields
  cy.get('va-text-input')
    .shadow()
    .find('input')
    .should('have.value', values[0].name);
  cy.get('va-text-input')
    .shadow()
    .find('input')
    .should('have.value', values[0].amount);

  // return to summary page
  customButtonGroupContinue(editButtonText);
};

export { fillChecklist, fillInputList, verifySummaryPage, verifyEditPage };
