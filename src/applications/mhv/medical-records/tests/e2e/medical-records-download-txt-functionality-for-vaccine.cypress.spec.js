import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VaccineDetailsPage from './pages/VaccineDetailsPage';
import VaccinesListPage from './pages/VaccinesListPage';
import defaultVaccines from './fixtures/vaccines/vaccines.json';

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

    // Given Navigate to Allergies Details Link
    VaccinesListPage.clickVaccinesDetailsLink(0, defaultVaccines.entry[0]);
    // Verify Details Page PrintDownload button
    VaccineDetailsPage.verifyPrintOrDownload('Print or download');
    // Click Details Page PrintDownload button
    VaccineDetailsPage.clickPrintOrDownload();
    // Details Page should display print button for a list "Print this list"
    VaccineDetailsPage.verifyPrintButton();
    // should display a download pdf file button "Download PDF of this page"
    VaccineDetailsPage.verifyDownloadPDF();
    // should display a download text file button "Download a text file (.txt) of this list"
    VaccineDetailsPage.verifyDownloadTextFile();

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
