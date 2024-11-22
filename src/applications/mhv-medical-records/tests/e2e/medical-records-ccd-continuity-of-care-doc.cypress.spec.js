import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import sessionStatus from './fixtures/session-status.json';

describe('Medical Records Authenticated Users', () => {
  it('Visits Medical Records Authenticated Users', () => {
    const site = new MedicalRecordsSite();
    site.login();
    site.loadPage();
    cy.intercept('POST', '/my_health/v1/medical_records/session', {
      statusCode: 204,
      body: {},
    }).as('session');
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', {
      statusCode: 200,
      body: sessionStatus, // status response copied from staging
    }).as('status');
    cy.visit('my-health/medical-records/download');

    cy.get('[data-testid="ccdAccordionItem"]').click();

    cy.get('[data-testid="generateCcdButton"]').should('be.visible');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
