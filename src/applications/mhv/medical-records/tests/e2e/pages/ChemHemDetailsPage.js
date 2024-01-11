class ChemHemDetailsPage {
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
    // should display a download text file button "Download list as a text file"
    cy.get('[data-testid="printButton-1"]').click();
  };
}

export default new ChemHemDetailsPage();
