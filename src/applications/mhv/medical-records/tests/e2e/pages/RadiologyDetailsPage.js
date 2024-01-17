// import defaultRadiology from '../fixtures/Radiology.json';
// import { cy } from "date-fns/locale";

class RadiologyDetailsPage {
  verifyLabName = name => {
    cy.get('[data-testid="radiology-name"]').should('contain', name);
  };

  verifyReason = reason => {
    cy.get('[data-testid="radiology-reason"]').should('contain', reason);
  };

  verifyClinicalHistory = history => {
    cy.get('[data-testid="radiology-clinical-history"]').should(
      'contain',
      history,
    );
  };

  verifyOrderedBy = orderedBy => {
    cy.get('[data-testid="radiology-ordered-by"]').should('contain', orderedBy);
  };

  verifyOrderingLocation = location => {
    cy.get('[data-testid="radiology-ordering-location"]').should(
      'contain',
      location,
    );
  };

  verifyImagingLocation = location => {
    cy.get('[data-testid="radiology-imaging-location"]').should(
      'contain',
      location,
    );
  };

  verifyImagingProvider = provider => {
    cy.get('[data-testid="radiology-imaging-provider"]').should(
      'contain',
      provider,
    );
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

  clickDownloadPDFFile = () => {
    // should display a download PDF file button "Download list as a PDF file"
    cy.get('[data-testid="printButton-1"]').click();
  };
}

export default new RadiologyDetailsPage();
