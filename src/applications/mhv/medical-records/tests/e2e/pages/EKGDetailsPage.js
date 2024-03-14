class EKGDetailsPage {
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

  clickDownloadTxtFile = () => {
    cy.get('[data-testid="printButton-2"]').click();
  };

  verifyTitle = recordName => {
    cy.get('[data-testid="ekg-record-name"]').should('be.visible');
    cy.get('[data-testid="ekg-record-name"]').contains(recordName);
  };

  verifyDate = date => {
    // In need of future revision:
    // See moment function in verifyVaccineDate() in VaccineDetailsPage.js
    cy.get('[data-testid="header-time"]').contains(date);
  };

  verifyOrderingLocation = facility => {
    cy.get('[data-testid="ekg-record-facility"]').contains(facility);
  };

  verifyResults = () => {
    cy.get('[data-testid="ekg-results"]').contains(
      'Your EKG results aren’t available in this tool. To get your EKG',
    );
    cy.get('[data-testid="ekg-results"]').contains(
      'results, you can request a copy of your complete medical record from',
    );
    cy.get('[data-testid="ekg-results"]').contains('your VA health facility.');
  };
}

export default new EKGDetailsPage();
