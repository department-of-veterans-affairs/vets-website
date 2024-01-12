// import defaultPathology from '../fixtures/Pathology.json';

class PathologyDetailsPage {
  verifyLabName = name => {
    cy.get('[data-testid="pathology-name"]').should('contain', name);
  };

  verifyLabDate = date => {
    cy.get('[data-testid="header-time"]').should('contain', date);
  };

  verifySampleTested = sampleTested => {
    cy.get('[data-testid="pathology-sample-tested"]').should(
      'contain',
      sampleTested,
    );
  };

  verifyLabLocation = location => {
    cy.get('[data-testid="pathology-location"]').should('contain', location);
  };

  verifyDateCompleted = dateCompleted => {
    cy.get('[data-testid="pathology-date-completed"]').should(
      'contain',
      dateCompleted,
    );
  };

  verifyPrintOrDownload = () => {
    cy.get('[data-testid="print-records-button"]').should('be.visible');
  };

  clickPrintOrDownload = () => {
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

  verifyEpnadUnderstandResultsBtton = () => {
    // Expand "help to be able to understand results"
    cy.get('[data-testid="understanding-result"]').should('be.visible');
  };

  clickExpnadUnderstandResultsBtton = () => {
    // Expand "help to be able to understand results"
    cy.get('[data-testid="understanding-result"]').click();
  };

  verifyResultAlert1 = resultAlert1 => {
    // should display  "If your results are outside the reference range"
    cy.get('[data-testid="result-Alert-1"]').should('be.visible');
    cy.get('[data-testid="result-Alert-1"]').contains(resultAlert1);
  };

  verifyResultAlert2 = resultAlert2 => {
    // should display  "Your provider will review your results. If you need to do anything, your provider will contact you."
    cy.get('[data-testid="result-Alert-2"]').should('be.visible');
    cy.get('[data-testid="result-Alert-2"]').contains(resultAlert2);
  };

  verifyResultAlert3 = resultAlert3 => {
    // should display  "If you have any questions, send a message to the care team that ordered this test"
    cy.get('[data-testid="result-Alert-3"]').should('be.visible');
    cy.get('[data-testid="result-Alert-3"]').contains(resultAlert3);
  };

  verifyComposeMessageLink = composeMessageLink => {
    // verify compose a message on the My Healthvet website
    cy.get('[data-testid="compose-message-Link"]').should('be.visible');
    cy.get('[data-testid="compose-message-Link"]').contains(composeMessageLink);
  };
}

export default new PathologyDetailsPage();
