import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import weightUnmapped from './fixtures/vitals-loinc-weight-unmapped.json';

// E2E: Observation with no recognized weight LOINC codes should be filtered out by allowedVitalLoincs (pre-canonical list)
// and thus no Weight card measurement should appear (Weight card may show no records message if other vitals omitted).

describe('Medical Records Vitals LOINC Mapping - Unmapped Weight', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Does not render weight measurement when only unmapped LOINCs provided', () => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/vitals',
      weightUnmapped,
    ).as('vitalsList');
    cy.visit('my-health/medical-records/vitals');
    cy.wait([
      '@vitalsList',
      '@vamcEhr',
      '@mockUser',
      '@featureToggles',
      '@maintenanceWindow',
      '@status',
    ]);

    // Weight card should exist (since we build cards from vitalTypes), but show no records message
    cy.get('[data-testid="vital-li-display-name"]')
      .contains('Weight')
      .parent()
      .within(() => {
        cy.contains(/There are no weight results/i);
      });
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
