import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../../fixtures/user/oracle-health.json';
import vitalsData from '../../fixtures/vitals/sample-lighthouse.json';

describe('Medical Records View Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: false,
      isAcceleratingVitals: false,
    });
    cy.visit('my-health/medical-records');

    Vitals.setIntercepts({ vitalData: vitalsData, useOhData: false });
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
