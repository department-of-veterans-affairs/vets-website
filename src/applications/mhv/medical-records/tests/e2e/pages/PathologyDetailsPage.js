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
}

export default new PathologyDetailsPage();
