import defaultLabsAndTests from '../fixtures/labs-and-tests/labsAndTests.json';
import radiologyRecordsMhv from '../fixtures/labs-and-tests/radiologyRecordsMhv.json';
// import radiologyRecordsMhv from '../../tests/fixtures/labs-and-tests/radiologyRecordsMhv.json';
import BaseListPage from './BaseListPage';

class LabsAndTestsListPage extends BaseListPage {
  goToLabsAndTests = (
    labsAndTests = defaultLabsAndTests,
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
    // cy.get('[href="/my-health/medical-records/labs-and-tests"]').click();
    cy.visit('my-health/medical-records/labs-and-tests');
    if (waitForLabsAndTests) {
      cy.wait('@LabsAndTestsList');
      cy.wait('@RadiologyRecordsMhv');
    }
  };

  clickLabsAndTestsDetailsLink = (_LabsAndTestsItemIndex = 0, entry) => {
    cy.intercept(
      'GET',
      `/my_health/v1/medical_records/labs_and_tests/${entry.resource.id}`,
      entry.resource,
    );
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_LabsAndTestsItemIndex)
      .click();
  };

  // "Radiology has no details call so we always use the list call for everything"
  // - Mike Moyer 08/01/2024
  clickRadiologyDetailsLink = (labsAndTestsItemIndex = 0) => {
    cy.get('[data-testid="record-list-item"]')
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
}
export default new LabsAndTestsListPage();
