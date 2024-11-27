import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
// import VitalsListPage from './pages/VitalsListPage';
import oracleHealthUser from '../../fixtures/user/oracle-health.json';
import vitals from '../../fixtures/vitals/sample-lighthouse.json';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: true,
    });
    cy.visit('my-health/medical-records');
    cy.intercept('POST', '/my_health/v1/medical_records/session').as('session');
    cy.intercept('GET', '/my_health/v1/medical_records/vitals*', req => {
      // check the correct param was used
      expect(req.url).to.contain('use_oh_data_path=1');
      req.reply(vitals);
    }).as('vitals-list');
  });

  it('Visits View Vitals List', () => {
    // check for MY Va Health links
    cy.get('[data-testid="labs-and-tests-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="summary-and-notes-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vaccines-oh-landing-page-link"]').should(
      'be.visible',
    );
    cy.get('[data-testid="health-conditions-oh-landing-page-link"]').should(
      'be.visible',
    );

    cy.get('[data-testid="allergies-oh-landing-page-link"]').should(
      'be.visible',
    );

    cy.get('[data-testid="vitals-landing-page-link"]')
      .should('be.visible')
      .click();

    cy.get("[data-testid='current-date-display']").should('be.visible');
    cy.get("[data-testid='current-date-display']").should('not.be.empty');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
