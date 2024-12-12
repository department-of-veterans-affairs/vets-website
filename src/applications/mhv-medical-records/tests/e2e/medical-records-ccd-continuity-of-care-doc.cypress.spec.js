import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import DownloadReportsPage from './pages/DownloadReportsPage';

describe('Medical Records download page', () => {
  it('Verifies CCD download', () => {
    const site = new MedicalRecordsSite();
    site.login();
    site.loadPage();

    DownloadReportsPage.goToReportsPage();

    DownloadReportsPage.clickCcdAccordionItem();

    DownloadReportsPage.verifyCcdDownloadXmlFileButton();

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
