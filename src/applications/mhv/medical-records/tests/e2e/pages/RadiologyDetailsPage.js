// import defaultRadiology from '../fixtures/Radiology.json';

class RadiologyDetailsPage {
  verifyTitle = recordName => {
    cy.get('[data-testid="radiology-record-name"]').should('be.visible');
    cy.get('[data-testid="radiology-record-name"]').contains(recordName);
  };

  verifyDate = date => {
    // In need of future revision:
    // See moment function in verifyVaccineDate() in VaccineDetailsPage.js
    cy.get('[data-testid="header-time"]').contains(date);
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

  verifyRadiologyImageLink = radiologyImage => {
    // Radiology Image Expand Button
    cy.get('[data-testid="radiology-image"]').should('be.visible');
    cy.get('[data-testid="radiology-image"]')
      .contains(radiologyImage)
      .invoke('attr', 'href')
      .should(
        'contain',
        'myhealth.va.gov/mhv-portal-web/va-medical-images-and-reports',
      );
    // href="https://mhv-syst.myhealth.va.gov/mhv-portal-web/va-medical-images-and-reports"
  };

  verifyRadiologyReason = reason => {
    cy.get('[data-testid="radiology-reason"]').should('be.visible');
    cy.get('[data-testid="radiology-reason"]').contains(reason);
  };

  verifyRadiologyClinicalHistory = clinicalHistory => {
    cy.get('[data-testid="radiology-clinical-history"]').should('be.visible');
    cy.get('[data-testid="radiology-clinical-history"]').contains(
      clinicalHistory,
    );
  };

  verifyRadiologyOrderedBy = orderedBy => {
    cy.get('[data-testid="radiology-ordered-by"]').should('be.visible');
    cy.get('[data-testid="radiology-ordered-by"]').contains(orderedBy);
  };

  verifyRadiologyImagingLocation = location => {
    cy.get('[data-testid="radiology-imaging-location"]').should('be.visible');
    cy.get('[data-testid="radiology-imaging-location"]').contains(location);
  };

  verifyRadiologyImagingProvider = provider => {
    cy.get('[data-testid="radiology-imaging-provider"]').should('be.visible');
    cy.get('[data-testid="radiology-imaging-provider"]').contains(provider);
  };

  verifyRadiologyResults = results => {
    cy.get('[data-testid="radiology-record-results"]').should('be.visible');
    cy.get('[data-testid="radiology-record-results"]').contains(results);
  };
}

export default new RadiologyDetailsPage();
