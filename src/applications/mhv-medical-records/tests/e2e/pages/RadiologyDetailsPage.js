// import imagingStudies from '../../fixtures/radiologyCvix.json'; // using dev's fixture for now
// import defaultRadiology from '../fixtures/Radiology.json';

import BaseDetailsPage from './BaseDetailsPage';

class RadiologyDetailsPage extends BaseDetailsPage {
  verifyTitle = recordName => {
    cy.get('[data-testid="radiology-record-name"]').should('be.visible');
    cy.get('[data-testid="radiology-record-name"]').contains(recordName);
  };

  verifyDate = date => {
    // In need of future revision:
    // See date formatting function in verifyVaccineDate() in VaccineDetailsPage.js
    cy.get('[data-testid="header-time"]').contains(date);
  };

  verifyComposeMessageLink = composeMessageLink => {
    // verify compose a message on the My Healthvet website
    cy.get('[data-testid="new-message-link"]').should('be.visible');
    cy.get('[data-testid="new-message-link"]')
      .contains(composeMessageLink)
      .invoke('attr', 'href')
      .should('contain', '/my-health/secure-messages/new-message');
  };

  verifyRadiologyImageLink = radiologyImage => {
    // Radiology Image Expand Button
    cy.get('[data-testid="radiology-images-link"]').should('be.visible');
    cy.get('[data-testid="radiology-images-link"]')
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

  interceptImagingEndpoint = imagingStudies => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/imaging',
      imagingStudies,
    ).as('imagingStudies');
  };

  interceptImagingStatus = statusResponse => {
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/imaging/status',
      statusResponse,
    );
  };

  clickRequestImages = () => {
    cy.get('[data-testid="request-images-button"]').click();
  };

  clickViewImages = (studyId, viewImagesResponse) => {
    cy.intercept(
      'GET',
      `/my_health/v1/medical_records/imaging/${studyId}/images`,
      viewImagesResponse,
    );
    cy.get('[data-testid="radiology-view-all-images"]')
      .contains('View all')
      .click();
  };

  verifyRadiologyImageCount = numImages => {
    cy.get('div.image-div')
      .find('img')
      .should('have.length', numImages);
  };

  verifyPaginationVisible = () => {
    cy.get('a:contains("Next")').should('be.visible');
  };

  verifyH1Focus = () => {
    cy.get('h1').should('have.focus');
  };

  verifyShowingImageRecords = (
    displayedStartNumber,
    displayedEndNumber,
    numRecords,
  ) => {
    cy.get('[data-testid="showing-image-records"]')
      .find('span')
      .should(
        'contain',
        `Showing ${displayedStartNumber} to ${displayedEndNumber} of ${numRecords} images`,
      );
  };
}

export default new RadiologyDetailsPage();
