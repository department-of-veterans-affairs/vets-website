import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vitalsData from '../fixtures/vitals/normalization-variants.json';

// E2E test to assert normalization of variant vital type labels:
//  - WEIGHT MEASURED -> Weight (measurement rendered in pounds)
//  - Sp O2 (variant spelling) -> Blood oxygen level (pulse oximetry)
// Uses accelerated vitals feature flag path.

describe('Medical Records Vitals Variant Normalization (Accelerated)', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(oracleHealthUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingVitals: true,
    });
    Vitals.setIntercepts({ vitalData: vitalsData });
  });

  it('Displays normalized vital cards for variant types', () => {
    site.loadPage();
    Vitals.goToVitalPage();

    // Select month/year covering variant dates (Jan 2014 in mock data)
    Vitals.selectMonthAndYear({ month: '1', year: 2014 });
    Vitals.verifySelectedDate({ dateString: 'January 2014' });

    // WEIGHT MEASURED -> normalized to WEIGHT (expect pounds)
    cy.get('[data-testid="vital-weight-measurement"]').should('be.visible');
    cy.get('[data-testid="vital-weight-measurement"]').contains('180 pounds');
    cy.get('[data-testid="vital-weight-date-timestamp"]').contains(
      'January 1, 2014',
    );

    // Sp O2 -> normalized to PULSE_OXIMETRY -> updatedRecordType BLOOD-OXYGEN-LEVEL
    // Therefore test IDs use `vital-blood-oxygen-level-*`
    cy.get('[data-testid="vital-blood-oxygen-level-measurement"]').should(
      'be.visible',
    );
    cy.get('[data-testid="vital-blood-oxygen-level-measurement"]').contains(
      '96%',
    );
    cy.get('[data-testid="vital-blood-oxygen-level-date-timestamp"]').contains(
      'January 1, 2014',
    );

    cy.injectAxeThenAxeCheck();
  });
});
