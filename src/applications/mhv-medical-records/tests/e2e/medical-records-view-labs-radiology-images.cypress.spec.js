import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import RadiologyDetailsPage from './pages/RadiologyDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import defaultLabsAndTests from './fixtures/labs-and-tests/labsAndTests.json';
import statusResponseComplete from './fixtures/labs-and-tests/imaging-status-response-complete.json';
import viewImagesResponse from './fixtures/labs-and-tests/imaging-view-images-response.json';
import imagingStudies from './fixtures/labs-and-tests/radiologyCvix.json';

describe('Medical Records - Radiology images are shown when requested', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    LabsAndTestsListPage.goToLabsAndTests(
      defaultLabsAndTests,
      imagingStudies,
      statusResponseComplete,
      true,
    );
  });

  it('View Radiology Images On Radiology Details Page', () => {
    LabsAndTestsListPage.clickRadiologyDetailsLink(
      'KNEE 4 OR MORE VIEWS (LEFT)',
    );
    const studyId = statusResponseComplete[0].studyIdUrn;
    RadiologyDetailsPage.clickViewImages(studyId, viewImagesResponse);

    RadiologyDetailsPage.verifyH1Focus();

    RadiologyDetailsPage.verifyRadiologyImageCount(10);

    RadiologyDetailsPage.verifyPaginationVisible();

    RadiologyDetailsPage.verifyShowingImageRecords(1, 10, 11);

    cy.injectAxe();
    cy.axeCheck('main', {});
  });
});
