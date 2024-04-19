// import defaultLabsAndTests from '../fixtures/LabsAndTests.json';
import BaseListPage from './BaseListPage';

class LabsAndTestsListPage extends BaseListPage {
  /*
    clickGotoLabsAndTestsLink = (
     /* LabsAndTests = defaultLabsAndTests,
      waitForLabsAndTests = false,
    ) => {
      cy.intercept(
        'GET',
        '/my_health/v1/medical_records/labs-and-tests',
        LabsAndTests,
      ).as('LabsAndTestsList');
      cy.get('[href="/my-health/medical-records/labs-and-tests"]').click();
      if (waitForLabsAndTests) {
        cy.wait('@LabsAndTestsList');
      }
    });
  }
  */

  clickLabsAndTestsDetailsLink = (_LabsAndTestsIndex = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_LabsAndTestsIndex)
      .click();
  };
}
export default new LabsAndTestsListPage();
