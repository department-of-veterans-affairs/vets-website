import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visits Medical Records, Views Network Error On Vitals List', () => {
    cy.intercept('GET', '/my_health/v1/medical_records/vitals*', {
      statusCode: 404,
    });
    cy.intercept('GET', '/my_health/v2/medical_records/vitals*', {
      statusCode: 404,
    });
    cy.visit('my-health/medical-records');
    cy.intercept('POST', '/my_health/v1/medical_records/session').as('session');
    cy.wait('@session');

    cy.visit('my-health/medical-records/vitals');
    cy.get('[data-testid="expired-alert-message"]').should('be.visible');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
