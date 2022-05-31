import { WIZARD_STATUS_NOT_STARTED } from 'applications/static-pages/wizard';
import { WIZARD_STATUS } from '../../wizard/constants';
import manifest from '../../manifest.json';

Cypress.config('waitForAnimations', true);

Cypress.Commands.add('checkStorage', (key, expectedValue) => {
  cy.window()
    .its(`sessionStorage.${key}`)
    .should('eq', expectedValue);
});

describe('Financial Status Report (Wizard)', () => {
  before(() => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_NOT_STARTED);
    cy.intercept('GET', '/v0/feature_toggles*', {
      data: {
        features: [
          { name: 'show_financial_status_report_wizard', value: true },
          { name: 'show_financial_status_report', value: true },
        ],
      },
    });
    cy.visit(manifest.rootUrl);
    cy.injectAxe();
  });

  it('should navigate the wizard and start the form', () => {
    const title = 'Request help with VA debt (VA Form 5655)';
    const heading = 'Is this the form I need?';
    cy.url().should('include', manifest.rootUrl);
    cy.get('h1').should('have.text', title);
    cy.get('.wizard-heading').should('have.text', heading);
    cy.get('[type="radio"][value="request"]').click();
    cy.get('[type="radio"][value="recipients"]').click();
    cy.get('[type="radio"][value="veteran"]').click();
    cy.get('.usa-button-primary').click();
    cy.checkStorage(WIZARD_STATUS, 'complete');
    cy.axeCheck();
  });
});
