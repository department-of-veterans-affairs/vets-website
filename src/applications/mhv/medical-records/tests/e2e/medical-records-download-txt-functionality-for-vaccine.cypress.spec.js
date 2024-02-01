import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VaccinesListPage from './pages/VaccinesListPage';

describe('Medical Records View Vaccines Print or download ', () => {
  const site = new MedicalRecordsSite();
  before(() => {
    site.login();
    cy.visit('my-health/medical-records/');
  });
  it('Vaccines Page Toggle Menu button Print or download ', () => {
    // Given Navigate to Vaccines List Page
    VaccinesListPage.clickGotoVaccinesLink();
    // Verify List Page  PrintDownload button
    VaccinesListPage.verifyPrintOrDownload('Print or download');
    // Click List Page PrintDownload button
    VaccinesListPage.clickPrintOrDownload();
    // List Page should display print button for a list "Print this list"
    VaccinesListPage.verifyPrintButton();
    // should display a download pdf file button "Download PDF of this page"
    VaccinesListPage.verifyDownloadPDF();
    // should display a download text file button "Download a text file (.txt) of this list"
    VaccinesListPage.verifyDownloadTextFile();

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
