import moment from 'moment-timezone';

class ChemHemDetailsPage {
  downloadTime1sec = '';

  downloadTime2sec = '';

  downloadTime3sec = '';

  downloadtime4sec = '';

  verifySampleTested = sampleTested => {
    cy.get('[data-testid="chem-hem-sample-tested"]').should(
      'contain',
      sampleTested,
    );
  };

  verifyLabName = name => {
    cy.get('[data-testid="chem-hem-name"]').should('contain', name);
  };

  verifyLabDate = date => {
    cy.get('[data-testid="header-time"]').should('contain', date);
  };

  verifyOrderedBy = orderedBy => {
    cy.get('[data-testid="chem-hem-ordered-by"]').should('contain', orderedBy);
  };

  verifyLabOrderingLocation = locationOrdered => {
    cy.get('[data-testid="chem-hem-ordering-location"]').should(
      'contain',
      locationOrdered,
    );
  };

  verifyLabCollectingLocation = locationCollected => {
    cy.get('[data-testid="chem-hem-collecting-location"]').should(
      'contain',
      locationCollected,
    );
  };

  verifyProviderNotes = notes => {
    cy.get('[data-testid="list-item-single"]').should('contain', notes);
  };

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

  verifyEpnadUnderstandResultsBtton = () => {
    // Expand "help to be able to understand results"
    cy.get('[data-testid="understanding-result"]').should('be.visible');
  };

  clickExpnadUnderstandResultsBtton = () => {
    // Expand "help to be able to understand results"
    cy.get('[data-testid="understanding-result"]').click();
  };

  verifyResultDropdownReferance = resultDropdownReferance => {
    // should display  "If your results are outside the reference range"
    cy.get('[data-testid="result-dropdown-1"]').should('be.visible');
    cy.get('[data-testid="result-dropdown-1"]').contains(
      resultDropdownReferance,
    );
  };

  verifyResultDropdownReviw = resultDropdownReviw => {
    // should display  "Your provider will review your results. If you need to do anything, your provider will contact you."
    cy.get('[data-testid="result-dropdown-2"]').should('be.visible');
    cy.get('[data-testid="result-dropdown-2"]').contains(resultDropdownReviw);
  };

  verifyResultDropdownQuestion = resultDropdownQuestion => {
    // should display  "If you have any questions, send a message to the care team that ordered this test"
    cy.get('[data-testid="result-dropdown-3"]').should('be.visible');
    cy.get('[data-testid="result-dropdown-3"]').contains(
      resultDropdownQuestion,
    );
  };

  verifyComposeMessageLink = composeMessageLink => {
    // verify compose a message on the My Healthvet website
    cy.get('[data-testid="compose-message-Link"]').should('be.visible');
    cy.get('[data-testid="compose-message-Link"]')
      .contains(composeMessageLink)
      .invoke('attr', 'href')
      .should('contain', 'myhealth.va.gov/mhv-portal-web/compose-message');
    // https://mhv-syst.myhealth.va.gov/mhv-portal-web/compose-message
  };
}

export default new ChemHemDetailsPage();
