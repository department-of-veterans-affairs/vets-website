import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import RadiologyDetailsPage from './pages/RadiologyDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';

describe('Medical Records Redirect Users to MHV Classic to view images', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    cy.visit('my-health/medical-records/labs-and-tests');
  });

  it('Navigate to MHV Classic to view their Radiology Images', () => {
    // Given As a Medical Records User I wanted to Navigate to "Radiology" Detail Page
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(4);
    RadiologyDetailsPage.clickExpnadRadiologyImageButton(0);

    cy.injectAxe();
    cy.axeCheck('main', {});
  });
});
