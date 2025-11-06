import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vitalsData from '../fixtures/vitals/body-height.json';

describe('Medical Records View Body Height', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: false, // This tests the isCerner LH Data implementation
    });
    Vitals.setIntercepts({ vitalData: vitalsData });
  });

  it('Visits View Vital List', () => {
    site.loadPage();

    Vitals.goToVitalPage();

    // check for latest id
    cy.get('[data-testid="vital-height-measurement"]').should('be.visible');
    cy.get('[data-testid="vital-height-measurement"]').contains('171.3 cm');

    cy.get('[data-testid="vital-height-date-timestamp"]').should('be.visible');
    cy.get('[data-testid="vital-height-date-timestamp"]').contains(
      'January 1, 2014',
    );

    cy.get('[data-testid="vital-height-review-over-time"]').should(
      'be.visible',
    );

    cy.injectAxeThenAxeCheck();
  });
});
