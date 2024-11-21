import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
// import VitalsListPage from './pages/VitalsListPage';
import oracleHealthUser from '../../fixtures/user/oracle-health.json';
import vitals from '../../fixtures/vitals/sample-lighthouse.json';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingVitals: false,
    });
    cy.visit('my-health/medical-records');
    cy.intercept('POST', '/my_health/v1/medical_records/session').as('session');
    cy.intercept('GET', '/my_health/v1/medical_records/vitals*', req => {
      // check the correct param was used
      expect(req.url).to.not.contain('use_oh_data_path=1');
      req.reply(vitals);
    }).as('vitals-list');
  });

  it('Visits View Vitals List', () => {
    // check for MY Va Health links
    cy.get('[data-testid="labs-and-tests-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="notes-landing-page-link"]').should('be.visible');
    cy.get('[data-testid="vaccines-landing-page-link"]').should('be.visible');
    cy.get('[data-testid="conditions-landing-page-link"]').should('be.visible');

    cy.get('[data-testid="allergies-landing-page-link"]').should('be.visible');

    cy.get('[data-testid="vitals-landing-page-link"]')
      .should('be.visible')
      .click();

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
