import { initExpressCareMocks } from './vaos-cypress-helpers';

describe('VAOS Express Care flow', () => {
  it('should submit a request successfully', () => {
    initExpressCareMocks();

    // Homepage
    cy.visit('health-care/schedule-view-va-appointments/appointments/');
    cy.injectAxe();
    cy.get('.va-modal-body button').click();
    cy.wait('@getRequestEligibilityCriteria');
    cy.axeCheckBestPractice();
    cy.findByText('Request Express Care').click();

    // Info page
    cy.findByText('How Express Care works');
    cy.url().should('include', '/new-express-care-request');
    cy.axeCheckBestPractice();
    cy.findByText('Continue with Express Care request').click();

    // Select reason page
    cy.findByText('Select a reason for your Express Care request');
    cy.url().should('include', '/new-express-care-request/select-reason');
    cy.axeCheckBestPractice();
    cy.findByLabelText('Cough').click();
    cy.findByText('Continue').click();

    // Additional Appointment detail
    cy.findByText('Express Care request details');
    cy.url().should('include', '/new-express-care-request/additional-details');
    cy.axeCheckBestPractice();
    cy.get('textarea').type('heavy cough');
    cy.findByText('Submit Express Care request').click();

    // Confirmation
    cy.findByText('You’ve successfully submitted your Express Care request');
    cy.url().should('include', '/new-express-care-request/confirmation');
  });
});
