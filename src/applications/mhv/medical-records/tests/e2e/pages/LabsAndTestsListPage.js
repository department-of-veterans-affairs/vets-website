// import defaultLabsAndTests from '../fixtures/LabsAndTests.json';

class LabsAndTestsListPage {
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

  verifyPrintOrDownload = () => {
    // should display a toggle menu button
    cy.get('[data-testid="print-records-button"]').should('be.visible');
    cy.get('[data-testid="print-records-button"]').click({ force: true });
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
    // should display a download pdf file button "Download list as a pdf file"
    cy.get('[data-testid="printButton-1"]').click();
  };
}
export default new LabsAndTestsListPage();
