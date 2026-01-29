import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

describe('Medical Records View Notes', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visits Medical Records, Views Network Error On Notes List', () => {
    // const site = new MedicalRecordsSite();
    // site.login();

    cy.intercept('GET', '/my_health/v1/medical_records/clinical_notes', {
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

    cy.visit('my-health/medical-records');
    cy.intercept('POST', '/my_health/v1/medical_records/session').as('session');
    cy.wait('@session');

    cy.get('[href="/my-health/medical-records/vaccines"]').should('be.visible');
    cy.visit('my-health/medical-records/summaries-and-notes');
    cy.get('[data-testid="expired-alert-message"]').should('be.visible');
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
