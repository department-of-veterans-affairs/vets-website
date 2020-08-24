import { initExpressCareMocks } from './vaos-cypress-helpers';

describe('Express Care request flow', () => {
  it('should go through flow successfully', () => {
    initExpressCareMocks();
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
    cy.get('.va-modal-body button').click();
    cy.wait('@getRequestEligibilityCriteria');
    cy.axeCheck();
    cy.findByText('Create an Express Care request').click();
    cy.findByText('How Express Care works');
    cy.axeCheck();
    cy.findByText('Continue with Express Care request').click({ force: true });
    cy.wait('@getRequestLimits');
    cy.findByText('Select a reason for your Express Care request');
    cy.axeCheck();
    cy.findByText('Cough').click();
    cy.findByText('Continue').click();
    cy.findByText('Express Care request details');
    cy.axeCheck();
    cy.get('textarea').type('heavy cough');
    cy.findByText('Submit Express Care request').click();
    cy.findByText('You’ve successfully submitted your Express Care request');
  });
});
