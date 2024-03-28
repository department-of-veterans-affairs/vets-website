import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import EKGDetailsPage from './pages/EKGDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';

describe('Medical Records View EKG Details', () => {
  const site = new MedicalRecordsSite();
  before(() => {
    site.login();
    cy.visit('my-health/medical-records/labs-and-tests');
  });
  it('Navigate to EKG Details page, verify fields', () => {
    // Given As a Medical Records User I wanted to Navigate to "EKG" Detail Page
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(3);
    EKGDetailsPage.verifyTitle('Electrocardiogram (EKG)');
    EKGDetailsPage.verifyDate('2000-12-14T11:35:00Z');
    EKGDetailsPage.verifyOrderingLocation('school parking lot');
    EKGDetailsPage.verifyResults();
    cy.injectAxe();
    cy.axeCheck('main', {});
  });
});
