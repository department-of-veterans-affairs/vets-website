import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import RadiologyDetailsPage from './pages/RadiologyDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import imagingStatusResponseComplete from './fixtures/imaging-status-response-complete.json';
// import imagingStatusResponseNew from './fixtures/imaging-status-response-new.json';
import imagingRequestImagesResponse from './fixtures/imaging-request-images-response.json';
import imagingViewImagesResponse from './fixtures/imaging-view-images-response.json';

describe('Medical Records Redirect Users to MHV Classic to view images', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
  });

  it('Navigate to MHV Classic to view their Radiology Images', () => {
    // Do I need to use a different status response?
    // or create multiple tests utilizing different responses?
    // THE TEST WILL BREAK without this intercept...
    cy.intercept(
      'GET',
      '/my_health/v1/medical_records/imaging/status',
      // imagingStatusResponseNew,
      imagingStatusResponseComplete,
    );

    LabsAndTestsListPage.clickRadiologyDetailsLink(0);
    const studyId = '453-2487450';
    // BUT THE TEST IS ABLE TO RUN WITHOUT THIS INTERCEPT
    cy.intercept(
      'GET',
      `/my_health/v1/medical_records/imaging/${studyId}/request`,
      imagingRequestImagesResponse,
    );
    // cy.wait(3000);

    // it seems like the page skips to the loading bar, before every clicking "request images"
    // ACTUALLY I think it stopped doing that.
    RadiologyDetailsPage.clickRequestImages();
    // wait for loading bar to finish
    // action item - look into other ways of handling this besides explicit waiting

    // cy.wait(7000);

    cy.intercept(
      'GET',
      // `/my_health/v1/medical_records/imaging/${studyId}/images`,
      // `/my_health/v1/medical_records/imaging/4001/images`,
      '/my_health/v1/medical_records/imaging/undefined/images',
      imagingViewImagesResponse,
    );
    RadiologyDetailsPage.clickViewImages();

    // RadiologyDetailsPage.verifyRadiologyImageLink(
    //   'Request images on the My HealtheVet website',
    // );

    cy.injectAxe();
    cy.axeCheck('main', {});
  });
});
