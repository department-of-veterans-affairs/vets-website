import MedicalRecordsSite from '../../mr_site/MedicalRecordsSite';
import LabsAndTests from '../pages/LabsAndTests';
import testUser from '../fixtures/user/non-oracle-health.json';
import defaultLabsAndTests from '../../fixtures/labs-and-tests/labsAndTests.json';

describe('Medical Records View Lab and Tests - Non-Oracle Health User', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login(testUser, false);
    site.mockFeatureToggles({
      isAcceleratingEnabled: true,
      isAcceleratingLabsAndTests: true,
    });

    // Non-Cerner users fall through to the legacy v1 API path even with
    // accelerated toggles enabled, because isAcceleratingLabsAndTests
    // requires isCerner to be true.
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/labs_and_tests',
      defaultLabsAndTests,
    ).as('LabsAndTestsList');
    cy.intercept('GET', '/my_health/v1/medical_records/radiology', []).as(
      'RadiologyRecordsMhv',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/imaging', []).as(
      'CvixRadiologyRecordsMhvImaging',
    );
    cy.intercept('GET', '/my_health/v1/medical_records/imaging/status', []).as(
      'imagingStatus',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/bbmi_notification/status',
      { flag: true },
    ).as('BbmiNotificationStatus');
    cy.intercept('POST', '/v0/datadog_action', {}).as('datadogAction');
  });

  it('renders the legacy labs and tests list for a non-Cerner user', () => {
    site.loadPage();

    // Check for labs and tests link on the landing page
    LabsAndTests.checkLandingPageLinks();

    LabsAndTests.goToLabAndTestPage();

    // Legacy path should NOT show the accelerated date range selector
    cy.get("[data-testid='filter-display-message']").should('not.exist');
    cy.get('select[name="dateRangeSelector"]').should('not.exist');

    // Legacy path should render the standard record list
    cy.get('[data-testid="record-list-item"]').should(
      'have.length.at.least',
      1,
    );

    cy.injectAxeThenAxeCheck();
  });
});
