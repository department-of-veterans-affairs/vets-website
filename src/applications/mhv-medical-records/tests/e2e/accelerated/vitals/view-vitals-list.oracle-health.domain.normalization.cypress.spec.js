import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import Vitals from '../pages/Vitals';
import oracleHealthUser from '../fixtures/user/oracle-health.json';
import vitalsData from '../fixtures/vitals/normalization-variants.json';

// E2E test to assert normalization of variant vital type labels:
//  - WEIGHT MEASURED -> Weight (data-testid expects 'vital-weight-...')
//  - Sp O2 (various SPO2 textual variant) -> Blood oxygen level (pulse oximetry)
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

    // Select month/year covering variant dates (Jan 2014 in mock data; UI uses March 2024 in other tests, but we just need list load)
    Vitals.selectMonthAndYear({ month: '1', year: 2014 });
    Vitals.verifySelectedDate({ dateString: 'January 2014' });

    // Weight measured -> normalized to Weight (canonical testid uses 'weight')
    cy.get('[data-testid="vital-weight-measurement"]').should('be.visible');
    cy.get('[data-testid="vital-weight-measurement"]').contains('180 lb');
    cy.get('[data-testid="vital-weight-date-timestamp"]').contains(
      'January 1, 2014',
    );

    // Sp O2 -> normalized to Blood oxygen level (test id uses oxygen-saturation-in-arterial-blood)
    cy.get(
      '[data-testid="vital-oxygen-saturation-in-arterial-blood-measurement"]',
    ).should('be.visible');
    cy.get(
      '[data-testid="vital-oxygen-saturation-in-arterial-blood-measurement"]',
    ).contains('96 %');
    cy.get(
      '[data-testid="vital-oxygen-saturation-in-arterial-blood-date-timestamp"]',
    ).contains('January 1, 2014');

    cy.injectAxeThenAxeCheck();
  });
});
