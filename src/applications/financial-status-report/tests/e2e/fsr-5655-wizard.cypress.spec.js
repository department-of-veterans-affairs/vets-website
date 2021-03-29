import { WIZARD_STATUS } from '../../wizard/constants';
import manifest from '../../manifest.json';

Cypress.config('waitForAnimations', true);

Cypress.Commands.add('checkStorage', (key, expectedValue) => {
  cy.window()
    .its(`sessionStorage.${key}`)
    .should('eq', expectedValue);
});

describe('Financial Status Report (Wizard)', () => {
  beforeEach(() => {
    window.dataLayer = [];
    sessionStorage.removeItem(WIZARD_STATUS);
    cy.visit(manifest.rootUrl);
    cy.injectAxe();
  });

  it('should show the wizard', () => {
    const heading = 'Is this the form I need?';
    cy.url().should('include', manifest.rootUrl);
    cy.get('.wizard-heading').should('have.text', heading);
    cy.axeCheck();
  });

  it('should navigate the wizard and start the form', () => {
    const title = 'Request help with VA debt (VA Form 5655)';
    cy.url().should('include', manifest.rootUrl);
    cy.get('[type="radio"][value="request"]').click();
    cy.get('[type="radio"][value="recipients"]').click();
    cy.get('[type="radio"][value="veteran"]').click();
    cy.get('.usa-button-primary').click();
    cy.get('h1').should('have.text', title);
    cy.checkStorage(WIZARD_STATUS, 'complete');
    cy.axeCheck();
  });
});
