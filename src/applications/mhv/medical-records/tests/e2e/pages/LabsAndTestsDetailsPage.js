import moment from 'moment-timezone';

class LabsAndTestsDetailsPage {
  downloadTime = '';

  verifyPrintButton = () => {
    // should display print button for a list "Print this list"
    cy.get('[data-testid="printButton-0"]').should('be.visible');
  };

  verifyPrintOrDownload = () => {
    cy.get('[data-testid="print-records-button"]').should('be.visible');
  };

  clickPrintOrDownload = () => {
    cy.get('[data-testid="print-records-button"]').click({ force: true });
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

  verifyDownloadTextFileHeadless = (
    userFirstName = 'Safari',
    userLastName = 'Mhvtp',
  ) => {
    // should display a download text file button "Download list as a text file"
    this.downloadTime = moment()
      .add(2, 'seconds')
      .format('M-D-YYYY_hhmmssa');
    if (Cypress.browser.isHeadless) {
      const downloadsFolder = Cypress.config('downloadsFolder');
      const txtPath = `${downloadsFolder}/VA-labs-and-tests-details-${userFirstName}-${userLastName}-${
        this.downloadTime
      }.txt`;
      cy.readFile(txtPath);
      cy.log(`This is the download Path  ${txtPath}`);

      // cy.readFile(`${downloadsFolder}/*`);
    }
    // cy.get('[data-testid="printButton-2').click();
  };

  clickDownloadTextFile = () => {
    cy.get('[data-testid="printButton-2').click();
    this.downloadTime = moment().format('M-D-YYYY_hhmmssa');
    cy.log(`download time = ${this.downloadTime}`);
  };

  clickDownloadPDFFile = () => {
    // should display a download text file button "Download list as a text file"
    cy.get('[data-testid="printButton-1"]').click();
  };
}

export default new LabsAndTestsDetailsPage();
