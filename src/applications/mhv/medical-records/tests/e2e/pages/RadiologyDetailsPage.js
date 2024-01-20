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

export default new RadiologyDetailsPage();
