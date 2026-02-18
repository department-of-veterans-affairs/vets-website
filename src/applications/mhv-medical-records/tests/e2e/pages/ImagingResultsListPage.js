import radiologyRecordsMhv from '../fixtures/labs-and-tests/radiologyRecordsMhv.json';
import BaseListPage from './BaseListPage';

class ImagingResultsListPage extends BaseListPage {
  goToImagingResults = (
    radiologyMhv = radiologyRecordsMhv,
    imaging = [],
    imagingStatus = [],
  ) => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/radiology',
      radiologyMhv,
    ).as('RadiologyRecordsMhv');
    cy.intercept('GET', '/my_health/v1/medical_records/imaging', imaging).as(
      'CvixRadiologyRecords',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/imaging/status',
      imagingStatus,
    ).as('CvixRadiologyRecordsStatus');
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/bbmi_notification/status',
      { flag: true },
    ).as('BbmiNotificationStatus');
    cy.intercept('POST', '/v0/datadog_action', {}).as('datadogAction');
    cy.visit('my-health/medical-records/imaging-results');
    cy.wait([
      '@RadiologyRecordsMhv',
      '@CvixRadiologyRecordsStatus',
      '@CvixRadiologyRecords',
      '@vamcEhr',
      '@mockUser',
      '@featureToggles',
    ]);
    // Wait for page to load
    cy.get('h1')
      .should('be.visible')
      .and('be.focused');
  };

  clickRadiologyDetailsLink = (heading, index = 0) => {
    // Ensure the text exists in a link somewhere (retries)
    cy.contains('a', heading, { includeShadowDom: true, timeout: 10000 });

    // If duplicates are possible, pick the indexed one
    cy.contains('a', heading, { includeShadowDom: true })
      .eq(index)
      .as('radLink');

    cy.get('@radLink').scrollIntoView();
    cy.get('@radLink').should('be.visible');
    cy.get('@radLink').click();
    // Wait for detail page to load - check for print menu as indicator
    cy.get('[data-testid="print-download-menu"]', { timeout: 10000 }).should(
      'be.visible',
    );
  };

  loadVAPaginationNext = () => {
    cy.get('#showingRecords').should('be.visible');
    cy.get('va-pagination').should('be.visible');
    cy.get('va-pagination')
      .shadow()
      .find('[class="usa-pagination__link usa-pagination__next-page"]')
      .click({ waitForAnimations: true });
  };

  verifyImagesReadyAlert = (alertText = 'Images ready') => {
    cy.get('[data-testid="alert-images-ready"]').should('be.visible');
    cy.get('[data-testid="alert-images-ready"]')
      .find('h3')
      .contains(alertText);
  };

  clickViewImages = (studyId, viewImagesResponse) => {
    cy.intercept(
      'GET',
      `/my_health/v1/medical_records/imaging/${studyId}/images`,
      viewImagesResponse,
    );
    cy.get('[data-testid="radiology-view-all-images"]')
      .contains('View all')
      .click();
  };

  verifyPageTitle = () => {
    cy.get('h1').contains('Medical imaging results');
  };

  verifyRecordCount = () => {
    cy.get('#showingRecords').should('be.visible');
  };

  verifyRecordListItems = () => {
    cy.get('[data-testid="record-list-item"]').should(
      'have.length.at.least',
      1,
    );
  };
}
export default new ImagingResultsListPage();
