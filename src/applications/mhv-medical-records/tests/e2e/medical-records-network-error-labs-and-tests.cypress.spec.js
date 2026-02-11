import MedicalRecordsSite from './mr_site/MedicalRecordsSite';

describe('Medical Records View Labs and Tests', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visits Medical Records, Views Network Error On Labs and Tests List', () => {
    // Intercept v1 endpoints
    cy.intercept('GET', '/my_health/v1/medical_records/labs_and_tests*', {
      statusCode: 404,
    });
    cy.intercept('GET', '/my_health/v1/medical_records/radiology*', {
      statusCode: 404,
    });
    cy.intercept('GET', '/my_health/v1/medical_records/imaging*', {
      statusCode: 404,
    });
    // Intercept v2 endpoints
    cy.intercept('GET', '/my_health/v2/medical_records/labs_and_tests*', {
      statusCode: 404,
    });
    cy.intercept('GET', '/my_health/v2/medical_records/imaging*', {
      statusCode: 404,
    });
    cy.visit('my-health/medical-records');
    cy.intercept('POST', '/my_health/v1/medical_records/session').as('session');
    cy.wait('@session');

    cy.visit('my-health/medical-records/labs-and-tests');
    cy.get('[data-testid="expired-alert-message"]', { timeout: 10000 }).should(
      'be.visible',
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
