// import defaultRadiology from '../fixtures/Radiology.json';

import BaseDetailsPage from './BaseDetailsPage';

class RadiologyDetailsPage extends BaseDetailsPage {
  verifyTitle = recordName => {
    cy.get('[data-testid="radiology-record-name"]').should('be.visible');
    cy.get('[data-testid="radiology-record-name"]').contains(recordName);
  };

  verifyDate = date => {
    // In need of future revision:
    // See moment function in verifyVaccineDate() in VaccineDetailsPage.js
    cy.get('[data-testid="header-time"]').contains(date);
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
}

export default new RadiologyDetailsPage();
