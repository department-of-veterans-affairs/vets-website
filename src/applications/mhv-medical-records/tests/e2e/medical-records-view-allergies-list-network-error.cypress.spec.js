// import AllergiesListPage from './pages/AllergiesListPage';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
// import allergies from './fixtures/allergies.json';
import sessionStatus from './fixtures/session-status.json';

describe('Medical Records View Allergies', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visits Medical Records View Allergies List Network Errors', () => {
    // const site = new MedicalRecordsSite();
    // site.login();

    cy.intercept('GET', '/my_health/v1/medical_records/allergies*', {
      statusCode: 400,
      body: {
        alertType: 'error',
        header: 'err.title',
        content: 'err.detail',
        response: {
          header: 'err.title',
          content: 'err.detail',
        },
      },
    }).as('folder');

    cy.intercept('POST', '/my_health/v1/medical_records/session', {
      statusCode: 204,
      body: {},
    }).as('session');
    cy.intercept('GET', '/my_health/v1/medical_records/session/status', {
      statusCode: 200,
      body: sessionStatus, // status response copied from staging
    }).as('status');

    cy.visit('my-health/medical-records');
    // cy.intercept('POST', '/my_health/v1/medical_records/session').as('session');
    // cy.wait('@session');

    cy.get('[href="/my-health/medical-records/vaccines"]').should('be.visible');
    cy.visit('my-health/medical-records/allergies');
    cy.get('[data-testid="expired-alert-message"]').should('be.visible');
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
