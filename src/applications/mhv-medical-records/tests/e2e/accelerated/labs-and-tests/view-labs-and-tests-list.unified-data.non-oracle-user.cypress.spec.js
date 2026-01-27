import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import testUser from '../fixtures/user/non-oracle-health.json';
import labsAndTestsData from '../../fixtures/labs-and-tests/labsAndTests.json';
import radiologyRecordsMhv from '../../fixtures/labs-and-tests/radiologyRecordsMhv.json';

// This test verifies that non-Cerner users can still view labs and tests
// when accelerated delivery feature toggles are enabled.
// Since accelerated delivery requires isCerner, non-Cerner users will use the v1 path.
describe('Medical Records View Lab and Tests - Non-Oracle Health User', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(testUser, false);
    // Feature toggles are enabled, but since user is not Cerner,
    // isAcceleratingLabsAndTests will be false and v1 endpoints will be used
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingLabsAndTests: true,
    });

    // Intercept v1 endpoints since non-Cerner users use the non-accelerated path
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/labs_and_tests',
      labsAndTestsData,
    ).as('LabsAndTestsList');
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/radiology',
      radiologyRecordsMhv,
    ).as('RadiologyRecordsMhv');
    cy.intercept('GET', '/my_health/v1/medical_records/imaging', []).as(
      'CvixRadiologyRecordsMhvImaging',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/imaging/status', []).as(
      'CvixRadiologyRecordsMhvImagingStatus',
    );
    cy.intercept('POST', '/v0/datadog_action', {}).as('datadogAction');
  });

  it('Visits View Labs And Test Page List as non-Cerner user', () => {
    // Visit labs and tests page directly
    cy.visit('my-health/medical-records/labs-and-tests');
    cy.wait([
      '@LabsAndTestsList',
      '@RadiologyRecordsMhv',
      '@CvixRadiologyRecordsMhvImagingStatus',
      '@CvixRadiologyRecordsMhvImaging',
    ]);

    cy.injectAxeThenAxeCheck();

    // Verify labs and tests list is displayed
    cy.get('[data-testid="record-list-item"]').should(
      'have.length.at.least',
      1,
    );
  });
});
