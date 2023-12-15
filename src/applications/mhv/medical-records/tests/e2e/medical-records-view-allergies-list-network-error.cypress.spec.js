// import AllergiesListPage from './pages/AllergiesListPage';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
// import allergies from './fixtures/allergies.json';

describe('Medical Records View Allergies', () => {
  it('Visits Medical Records View Allergies List Network Errors', () => {
    const site = new MedicalRecordsSite();
    site.login();

    // cy.visit('my-health/medical-records');
    // AllergiesListPage.clickGotoAllergiesLink(allergies);

    cy.visit('my-health/medical-records/vaccines');

    cy.intercept('GET', '/my_health/v1/medical_records/allergies', {
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

    cy.get('[data-testid="expired-alert-message"]').should('be.visible');
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
