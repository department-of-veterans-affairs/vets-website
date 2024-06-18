import defaultLabsAndTests from '../fixtures/labsAndTests.json';
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
    // cy.get('[href="/my-health/medical-records/labs-and-tests"]').click();
    cy.visit('my-health/medical-records/labs-and-tests');
    if (waitForLabsAndTests) {
      cy.wait('@LabsAndTestsList');
    }
  };

  clickLabsAndTestsDetailsLink = (_LabsAndTestsItemIndex = 0, entry) => {
    cy.intercept(
      'GET',
      `/my_health/v1/medical_records/labs_and_tests/${entry.id}`,
      entry,
    );
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_LabsAndTestsItemIndex)
      .click();
  };
}
export default new LabsAndTestsListPage();
