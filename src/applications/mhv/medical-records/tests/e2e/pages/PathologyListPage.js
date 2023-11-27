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
*/

  clickPathologyDetailsLink = (_PathologyIndex = 0) => {
    cy.get('[data-testid="record-list-item"]')
      .find('a')
      .eq(_PathologyIndex)
      .click();
  };

  verifyPrintButton = () => {
    // should display print button for a list "Print this list"
    cy.get('[data-testid="printButton-0"]').should('be.visible');
  };

  verifyDownloadPDF = () => {
    // should display a download pdf file button "Download PDF of this page"
    cy.get('[data-testid="printButton-1"]').should('be.visible');
  };

  verifyDownloadTextFile = () => {
    // should display a download text file button "Download list as a text file"
    cy.get('[data-testid="printButton-2"]').should('be.visible');
    // cy.get('[data-testid="printButton-2').click();
  };

  clickDownloadPDFFile = () => {
    // should display a download text file button "Download list as a text file"
    cy.get('[data-testid="printButton-1"]').click();
  };
}

export default new PathologyListPage();
