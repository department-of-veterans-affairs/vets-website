class BaseListPage {
  verifyPrintOrDownload = () => {
    cy.get('[data-testid="print-download-menu"]').should('be.visible');
  };

  clickPrintOrDownload = () => {
    // Wait for menu button to be visible, then click
    cy.get('[data-testid="print-download-menu"]')
      .should('be.visible')
      .click();
    // Wait for menu to open
    cy.get('[data-testid="print-download-menu"]').should(
      'have.attr',
      'aria-expanded',
      'true',
    );
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

  clickDownloadTxtFile = () => {
    cy.get('[data-testid="printButton-2"]').click();
  };
}
export default BaseListPage;
