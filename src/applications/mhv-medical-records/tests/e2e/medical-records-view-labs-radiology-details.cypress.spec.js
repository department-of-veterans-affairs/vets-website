import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import RadiologyDetailsPage from './pages/RadiologyDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import labsAndTests from '../fixtures/labsAndTests.json';

describe('Medical Records Redirect Users to MHV Classic to view images', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
  });

  it('Navigate to MHV Classic to view their Radiology Images', () => {
    // Given As a Medical Records User I wanted to Navigate to "Radiology" Detail Page
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(5, labsAndTests.entry[5]);
    RadiologyDetailsPage.verifyTitle(
      'RADIOLOGIC EXAMINATION, SPINE, LUMBOSACRAL; 2 OR 3 VIEWS',
    );
    RadiologyDetailsPage.verifyDate('September 24, 2004');
    RadiologyDetailsPage.verifyRadiologyReason('None noted');
    RadiologyDetailsPage.verifyRadiologyClinicalHistory('None noted');
    RadiologyDetailsPage.verifyRadiologyOrderedBy('DOE, JOHN A');
    RadiologyDetailsPage.verifyRadiologyImagingLocation(
      'DOE, JOHN A, DAYT29 TEST LAB',
    );
    RadiologyDetailsPage.verifyRadiologyImagingProvider('None noted');
    RadiologyDetailsPage.verifyRadiologyResults(
      'SPINE LUMBOSACRAL MIN 2 VIEWS',
    );
    cy.injectAxe();
    cy.axeCheck('main', {});
  });
});
