import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

describe('Medical Records View Health-Conditions', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visits Medical Records, Views Network Error On Health-Conditions List', () => {
    cy.intercept('GET', '/my_health/v1/medical_records/conditions', {
      statusCode: 404,
    });
    cy.visit('my-health/medical-records');
    cy.intercept('POST', '/my_health/v1/medical_records/session').as('session');
    cy.wait('@session');

    cy.visit('my-health/medical-records/conditions');
    cy.get('[data-testid="expired-alert-message"]').should('be.visible');
  });
});
