import { WIZARD_STATUS, ROOT_URL } from '../../wizard/constants';

Cypress.Commands.add('checkStorage', (key, expectedValue) => {
  cy.window()
    .its(`sessionStorage.${key}`)
    .should('eq', expectedValue);
});

describe('Financial Status Report (Wizard)', () => {
  beforeEach(() => {
    window.dataLayer = [];
    sessionStorage.removeItem(WIZARD_STATUS);
    cy.visit(ROOT_URL);
    cy.injectAxe();
  });

  it('should show the wizard', () => {
    const heading = 'Is this the form I need?';
    cy.url().should('include', ROOT_URL);
    cy.get('.wizard-heading').should('have.text', heading);
    cy.axeCheck();
  });

  it('should navigate the wizard and start the form', () => {
    const title = 'Request help with VA debt (VA Form 5655)';
    cy.get('[type="radio"][value="request"]').click();
    cy.get('[type="radio"][value="recipients"]').click();
    cy.get('[type="radio"][value="veteran"]').click();
    cy.get('.usa-button-primary').click();
    cy.get('h1').should('have.text', title);
    cy.focused().should('have.text', title);
    cy.checkStorage(WIZARD_STATUS, 'complete');
    cy.axeCheck();
  });
});
