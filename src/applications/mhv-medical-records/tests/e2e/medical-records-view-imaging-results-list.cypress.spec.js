import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import ImagingResultsListPage from './pages/ImagingResultsListPage';
import radiologyRecordsMhv from './fixtures/labs-and-tests/radiologyRecordsMhv.json';
import statusResponseComplete from './fixtures/labs-and-tests/imaging-status-response-complete.json';
import viewImagesResponse from './fixtures/labs-and-tests/imaging-view-images-response-4.json';
import imagingStudies from './fixtures/labs-and-tests/radiologyCvix.json';

describe('Medical Records View Imaging Results List', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visits Medical Records Imaging Results List Page', () => {
    ImagingResultsListPage.goToImagingResults(
      radiologyRecordsMhv,
      imagingStudies,
      statusResponseComplete,
    );
    cy.url().should('contain', 'imaging-results');

    ImagingResultsListPage.verifyPageTitle();
    ImagingResultsListPage.verifyRecordListItems();

    cy.injectAxe();
    cy.axeCheck();
  });

  it('Displays Images Ready Alert when images are complete', () => {
    ImagingResultsListPage.goToImagingResults(
      radiologyRecordsMhv,
      imagingStudies,
      statusResponseComplete,
    );

    ImagingResultsListPage.verifyImagesReadyAlert();
    const studyId = statusResponseComplete[0].studyIdUrn;
    ImagingResultsListPage.clickViewImages(studyId, viewImagesResponse);

    cy.injectAxe();
    cy.axeCheck();
  });

  it('Can navigate to radiology details from list', () => {
    ImagingResultsListPage.goToImagingResults(
      radiologyRecordsMhv,
      imagingStudies,
      [],
    );

    ImagingResultsListPage.clickRadiologyDetailsLink('CHEST 2 VIEWS PA&LAT');
    cy.url().should('contain', 'imaging-results/r');

    cy.injectAxe();
    cy.axeCheck('main', {});
  });
});
