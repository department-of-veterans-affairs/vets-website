import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import RadiologyDetailsPage from './pages/RadiologyDetailsPage';

describe('Medical Records View Labs And Tests', () => {
  it('Visits Medical Records View Radiology Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(4);
    RadiologyDetailsPage.verifyReason('None noted');
    RadiologyDetailsPage.verifyClinicalHistory('None noted');
    RadiologyDetailsPage.verifyOrderedBy('GARFUNKEL,FELIX');
    RadiologyDetailsPage.verifyOrderingLocation('None noted');
    RadiologyDetailsPage.verifyImagingLocation(
      'GARFUNKEL,FELIX, DAYT29 TEST LAB',
    );
    RadiologyDetailsPage.verifyImagingProvider('None noted');

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
