import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import DownloadReportsPage from './pages/DownloadReportsPage';

describe('Medical Records download CCD page', () => {
  it('Verify CCD download error', () => {
    const site = new MedicalRecordsSite();
    site.login();
    site.loadPage();

    DownloadReportsPage.goToReportsPage();

    DownloadReportsPage.clickCcdAccordionItem();

    DownloadReportsPage.verifyCcdDownloadXmlFileButton();

    DownloadReportsPage.clickCcdDownloadXmlFileButton();

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
