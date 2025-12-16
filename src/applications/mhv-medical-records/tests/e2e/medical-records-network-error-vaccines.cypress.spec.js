import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import oracleHealthUser from './accelerated/fixtures/user/oracle-health.json';

describe('Medical Records View Vaccines', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles();
  });

  it('Visits Medical Records, Views Network Error On Vaccines List', () => {
    // const site = new MedicalRecordsSite();
    // site.login();
    cy.intercept('GET', '/my_health/v2/medical_records/immunization*', {
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
    }).as('vaccines-list');

    cy.visit('my-health/medical-records');
    cy.intercept('POST', '/my_health/v1/medical_records/session').as('session');
    cy.wait('@session');

    cy.get('[href="/my-health/medical-records/vaccines"]').should('be.visible');
    cy.visit('my-health/medical-records/vaccines');
    cy.get('[data-testid="expired-alert-message"]').should('be.visible');
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
