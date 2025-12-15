import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import weightVariants from './fixtures/vitals-loinc-weight-variants.json';

// E2E: LOINC mapping chooses canonical WEIGHT when multiple weight LOINCs present
// (29463-7 + 3141-9) with differing code.text and proprietary vendor code.

describe('Medical Records Vitals LOINC Mapping - Weight Variants', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Renders Weight card using canonical mapping from any weight LOINC', () => {
    // Intercept vitals with our variant weight bundle
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/vitals',
      weightVariants,
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

    // Expect the Weight card to render (value + date)
    cy.get('[data-testid="vital-li-display-name"]').contains('Weight');
    cy.get('[data-testid="vital-li-measurement"]').contains('180 pounds');
    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
