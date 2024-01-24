import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

describe('Medical Records View Vaccines', () => {
  it('Visits Medical Records View Vaccines List Network Errors', () => {
    const site = new MedicalRecordsSite();
    site.login();

    // AllergiesListPage.clickGotoAllergiesLink(allergies);

    cy.visit('my-health/medical-records/vaccines');

    // See medical-records-view-allergies-list-network-error
    // Change the path URL (note they don't match in that file, fix that too)
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
