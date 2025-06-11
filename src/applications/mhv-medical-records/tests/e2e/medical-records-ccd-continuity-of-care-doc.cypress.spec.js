import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import DownloadReportsPage from './pages/DownloadReportsPage';
import ccdGenerateResponse from './fixtures/ccd-generate-response.json';
// import ccdDownloadResponse from './fixtures/ccd-download-response.xml';

describe('Medical Records download page', () => {
  it('Verifies CCD download', () => {
    const site = new MedicalRecordsSite();
    site.login();
    site.loadPage();

    DownloadReportsPage.goToReportsPage();

    DownloadReportsPage.clickCcdAccordionItem();

    const pathToCcdDownloadResponse =
      './applications/mhv-medical-records/tests/e2e/fixtures/ccd-download-response.xml';

    DownloadReportsPage.clickCcdDownloadXmlFileButton(
      ccdGenerateResponse,
      pathToCcdDownloadResponse,
    );

    DownloadReportsPage.verifyCcdDownloadStartedAlert();

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
