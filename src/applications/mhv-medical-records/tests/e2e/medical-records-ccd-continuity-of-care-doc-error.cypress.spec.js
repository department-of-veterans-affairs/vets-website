import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import DownloadReportsPage from './pages/DownloadReportsPage';
import ccdGenerateErrorResponse from './fixtures/ccd-generate-response-error.json';

describe('Medical Records download CCD page', () => {
  it('Verify CCD download error', () => {
    const site = new MedicalRecordsSite();
    site.login();
    site.loadPage();

    DownloadReportsPage.goToReportsPage();

    DownloadReportsPage.clickCcdAccordionItem();

    DownloadReportsPage.verifyCcdDownloadXmlFileButton();

    const generateResponseWithNewDate = DownloadReportsPage.updateDateGenerated(
      ccdGenerateErrorResponse,
    );

    DownloadReportsPage.clickCcdDownloadXmlFileButtonWithoutDownloadIntercept(
      generateResponseWithNewDate,
    );

    DownloadReportsPage.verifyCcdExpiredError();

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
