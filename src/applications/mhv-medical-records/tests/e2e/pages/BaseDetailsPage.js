class BaseDetailsPage {
  verifyPrintOrDownload = () => {
    cy.get('[data-testid="print-download-menu"]').should('be.visible');
  };

  clickPrintOrDownload = () => {
    // Wait for menu button to be visible and enabled, then click
    cy.get('[data-testid="print-download-menu"]')
      .should('be.visible')
      .and('not.be.disabled')
      .click();
    // Wait for menu to actually open (longer timeout for CI)
    cy.get('[data-testid="print-download-menu"]', { timeout: 10000 }).should(
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

  verifyExpandUnderstandResults = () => {
    // Expand "help to be able to understand results"
    cy.get('[data-testid="understanding-result"]').should('be.visible');
  };

  clickExpandUnderstandResults = () => {
    // Expand "help to be able to understand results"
    cy.get('[data-testid="understanding-result"]').click();
  };

  verifyResultDropdownReference = resultDropdownReference => {
    // should display  "If your results are outside the reference range"
    cy.get('[data-testid="result-dropdown-1"]').should('be.visible');
    cy.get('[data-testid="result-dropdown-1"]').contains(
      resultDropdownReference,
    );
  };

  verifyResultDropdownReview = resultDropdownReview => {
    // should display  "Your provider will review your results. If you need to do anything, your provider will contact you."
    cy.get('[data-testid="result-dropdown-2"]').should('be.visible');
    cy.get('[data-testid="result-dropdown-2"]').contains(resultDropdownReview);
  };

  verifyResultDropdownQuestion = resultDropdownQuestion => {
    // should display  "If you have any questions, send a message to the care team that ordered this test"
    cy.get('[data-testid="result-dropdown-3"]').should('be.visible');
    cy.get('[data-testid="result-dropdown-3"]').contains(
      resultDropdownQuestion,
    );
  };
}
export default BaseDetailsPage;
