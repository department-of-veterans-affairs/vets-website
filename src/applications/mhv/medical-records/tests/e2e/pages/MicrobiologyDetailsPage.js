// import defaultMicrobiology from './fixtures/microbiology.json';

class MicrobiologyDetailsPage {
  verifyLabName = name => {
    cy.get('[data-testid="microbio-name"]').should('contain', name);
  };

  verifyLabDate = date => {
    cy.get('[data-testid="header-time"]').should('contain', date);
  };

  verifySampleTested = sampleTested => {
    cy.get('[data-testid="microbio-sample-tested"]').should(
      'contain',
      sampleTested,
    );
  };

  verifySampleFrom = sampleFrom => {
    cy.get('[data-testid="microbio-sample-from"]').should(
      'contain',
      sampleFrom,
    );
  };

  verifyOrderedBy = orderedBy => {
    cy.get('[data-testid="microbio-ordered-by"]').should('contain', orderedBy);
  };

  verifyOrderingLocation = orderingLocation => {
    cy.get('[data-testid="microbio-ordering-location"]').should(
      'contain',
      orderingLocation,
    );
  };

  verifyCollectingLocation = collectingLocation => {
    cy.get('[data-testid="microbio-collecting-location"]').should(
      'contain',
      collectingLocation,
    );
  };

  verifyLabLocation = labLocation => {
    cy.get('[data-testid="microbio-lab-location"]').should(
      'contain',
      labLocation,
    );
  };

  verifyDateCompleted = dateCompleted => {
    cy.get('[data-testid="microbio-date-completed"]').should(
      'contain',
      dateCompleted,
    );
  };

  verifyPrintButton = () => {
    // should display print button for a list "Print this list"
    cy.get('[data-testid="printButton-0"]').should('be.visible');
  };

  verifyPrintOrDownload = () => {
    // should display a toggle menu button
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
  };
}

export default new MicrobiologyDetailsPage();
