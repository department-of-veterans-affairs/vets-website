import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import DownloadReportsPage from './pages/DownloadReportsPage';
import ccdGenerateResponse from './fixtures/ccd-generate-response.json';

describe('Medical Records download page', () => {
  it('Verifies CCD download', () => {
    const site = new MedicalRecordsSite();
    site.login();
    site.loadPage();

    DownloadReportsPage.goToReportsPage();

    DownloadReportsPage.clickCcdAccordionItem();

    DownloadReportsPage.verifyCcdDownloadXmlFileButton();

    DownloadReportsPage.clickCcdDownloadXmlFileButton(ccdGenerateResponse);

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
