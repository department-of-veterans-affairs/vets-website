// import defaultPathology from './fixtures/Pathology.json';

class PathologyListPage {
  /*
  clickGotoPathologyLink = (
   Pathology = defaultPathology,
    waitForPathology = false,
  ) => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/Pathology',
      Pathology,
    ).as('PathologyList');
    cy.get('[href="/my-health/medical-records/Pathology"]').click();
    if (waitForPathology) {
      cy.wait('@PathologyList');
    }
  };


  clickPathologyDetailsLink = (_PathologyIndex = 9) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_PathologyIndex)
      .click();
 
  };
*/
}

export default new PathologyListPage();
