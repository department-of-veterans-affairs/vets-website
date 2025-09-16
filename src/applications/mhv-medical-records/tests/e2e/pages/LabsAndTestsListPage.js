import defaultLabsAndTests from '../fixtures/labs-and-tests/labsAndTests.json';
import radiologyRecordsMhv from '../fixtures/labs-and-tests/radiologyRecordsMhv.json';
import BaseListPage from './BaseListPage';

class LabsAndTestsListPage extends BaseListPage {
  goToLabsAndTests = (
    labsAndTests = defaultLabsAndTests,
    imaging = [],
    imagingStatus = [],
    waitForLabsAndTests = false,
  ) => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/labs_and_tests',
      labsAndTests,
    ).as('LabsAndTestsList');
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/radiology',
      radiologyRecordsMhv,
    ).as('RadiologyRecordsMhv');
    cy.intercept('GET', '/my_health/v1/medical_records/imaging', imaging).as(
      'CvixRadiologyRecordsMhvImaging',
    );
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/imaging/status',
      imagingStatus,
    ).as('CvixRadiologyRecordsMhvImagingStatus');
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/bbmi_notification/status',
      { flag: true },
    ).as('BbmiNotificationStatus');
    cy.intercept('POST', '/v0/datadog_action', {}).as('datadogAction');
    // cy.get('[href="/my-health/medical-records/labs-and-tests"]').click();
    cy.visit('my-health/medical-records/labs-and-tests');
    if (waitForLabsAndTests) {
      cy.wait('@LabsAndTestsList');
      cy.wait('@RadiologyRecordsMhv');
      cy.wait('@CvixRadiologyRecordsMhvImagingStatus');
    }
  };

  clickLabsAndTestsDetailsLink = (_LabsAndTestsItemIndex = 0, entry) => {
    cy.intercept(
      'GET',
      `/my_health/v1/medical_records/labs_and_tests/${entry.resource.id}`,
      entry.resource,
    );
    cy.findAllByTestId('record-list-item')
      .find('a')
      .eq(_LabsAndTestsItemIndex)
      .click();
  };

  // "Radiology has no details call so we always use the list call for everything"
  // - Mike Moyer 08/01/2024
  clickRadiologyDetailsLink = (labsAndTestsItemIndex = 0) => {
    cy.findAllByTestId('record-list-item')
      .find('a')
      .eq(labsAndTestsItemIndex)
      .click();
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
}
export default new LabsAndTestsListPage();
