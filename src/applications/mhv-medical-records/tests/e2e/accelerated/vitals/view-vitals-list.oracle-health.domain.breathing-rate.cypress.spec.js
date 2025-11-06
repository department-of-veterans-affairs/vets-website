import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vitalsData from '../fixtures/vitals/breathing-rate.json';

describe('Medical Records View Breathing Rate', () => {
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
    cy.get('[data-testid="vital-breathing-rate-measurement"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-breathing-rate-measurement"]').contains(
      '13 breaths per minute',
    );

    cy.get('[data-testid="vital-breathing-rate-date-timestamp"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-breathing-rate-date-timestamp"]').contains(
      'January 18, 2017',
    );

    cy.get('[data-testid="vital-breathing-rate-review-over-time"]').should(
      'be.visible',
    );

    cy.injectAxeThenAxeCheck();
  });
});
