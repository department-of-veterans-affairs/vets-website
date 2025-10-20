import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import defaultLabsAndTests from './fixtures/labs-and-tests/labsAndTests.json';
import statusResponseComplete from './fixtures/labs-and-tests/imaging-status-response-complete.json';
import viewImagesResponse from './fixtures/labs-and-tests/imaging-view-images-response-4.json';
import imagingStudies from './fixtures/labs-and-tests/radiologyCvix.json';

describe('Medical Records View Labs and Tests', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Visits Medical Records View Labs and Tests', () => {
    // const site = new MedicalRecordsSite();
    // site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests(
      defaultLabsAndTests,
      imagingStudies,
      statusResponseComplete,
      true,
    );
    cy.url().should('not.include', `timeFrame`);

    LabsAndTestsListPage.verifyImagesReadyAlert();
    const studyId = statusResponseComplete[0].studyIdUrn;
    LabsAndTestsListPage.clickViewImages(studyId, viewImagesResponse);

    cy.injectAxe();
    cy.axeCheck();
  });
});
