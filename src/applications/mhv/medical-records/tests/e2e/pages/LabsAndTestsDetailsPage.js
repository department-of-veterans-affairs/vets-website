import moment from 'moment-timezone';

class LabsAndTestsDetailsPage {
  downloadTime1sec = '';

  downloadTime2sec = '';

  downloadTime3sec = '';

  downloadtime4sec = '';

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
    searchText = 'Date',
  ) => {
    // should display a download text file button "Download list as a text file"
    this.downloadTime1sec = moment()
      .add(1, 'seconds')
      .format('M-D-YYYY_hhmmssa');
    this.downloadTime2sec = moment()
      .add(2, 'seconds')
      .format('M-D-YYYY_hhmmssa');
    this.downloadTime3sec = moment()
      .add(3, 'seconds')
      .format('M-D-YYYY_hhmmssa');

    if (Cypress.browser.isHeadless) {
      cy.log('browser is headless');
      const downloadsFolder = Cypress.config('downloadsFolder');
      const txtPath1 = `${downloadsFolder}/VA-labs-and-tests-details-${userFirstName}-${userLastName}-${
        this.downloadTime1sec
      }.txt`;
      const txtPath2 = `${downloadsFolder}/VA-labs-and-tests-details-${userFirstName}-${userLastName}-${
        this.downloadTime2sec
      }.txt`;
      const txtPath3 = `${downloadsFolder}/VA-labs-and-tests-details-${userFirstName}-${userLastName}-${
        this.downloadTime3sec
      }.txt`;
      this.internalReadFileMaybe(txtPath1, searchText);
      this.internalReadFileMaybe(txtPath2, searchText);
      this.internalReadFileMaybe(txtPath3, searchText);
      // cy.readFile(`${downloadsFolder}/*`);
    } else {
      cy.log('browser is not headless');
    }
    // cy.get('[data-testid="printButton-2').click();
  };

  internalReadFileMaybe = (fileName, searchText) => {
    cy.task('log', `attempting to find file = ${fileName}`);
    cy.task('readFileMaybe', fileName).then(textOrNull => {
      const taskFileName = fileName;
      if (textOrNull != null) {
        cy.task('log', `found the text in ${taskFileName}`);
        cy.readFile(fileName).should('contain', `${searchText}`);
      }
    });
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
