import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import RadiologyDetailsPage from './pages/RadiologyDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import statusResponseComplete from './fixtures/labs-and-tests/imaging-status-response-complete.json';
import viewImagesResponse from './fixtures/labs-and-tests/imaging-view-images-response.json';
import imagingStudies from './fixtures/labs-and-tests/radiologyCvix.json';

describe('Medical Records Redirect Users to MHV Classic to view images', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
  });

  it('View Radiology Images On Radiology Details Page', () => {
    RadiologyDetailsPage.interceptImagingEndpoint(imagingStudies);

    RadiologyDetailsPage.interceptImagingStatus(statusResponseComplete);

    LabsAndTestsListPage.clickRadiologyDetailsLink(0);

    const studyId = statusResponseComplete[0].studyIdUrn;
    RadiologyDetailsPage.clickViewImages(studyId, viewImagesResponse);

    RadiologyDetailsPage.verifyFocus();

    RadiologyDetailsPage.verifyRadiologyImageCount(10);

    RadiologyDetailsPage.verifyPaginationVisible();

    // RadiologyDetailsPage.verifyRadiologyImageLink(
    //   'Request images on the My HealtheVet website',
    // );

    cy.injectAxe();
    cy.axeCheck('main', {});
  });
});
