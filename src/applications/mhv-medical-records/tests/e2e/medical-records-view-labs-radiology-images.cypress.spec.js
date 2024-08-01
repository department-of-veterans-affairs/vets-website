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
    LabsAndTestsListPage.loadVAPaginationNext();
    // I think the second parameter doesn't do anything in this case...
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(5, labsAndTests.entry[2]);

    RadiologyDetailsPage.verifyRadiologyImageLink(
      'Request images on the My HealtheVet website',
    );

    cy.injectAxe();
    cy.axeCheck('main', {});
  });
});
