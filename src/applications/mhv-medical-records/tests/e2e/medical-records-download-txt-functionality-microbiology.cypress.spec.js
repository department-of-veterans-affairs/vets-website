import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import MicrobiologyDetailsPage from './pages/MicrobiologyDetailsPage';
import labsAndTests from './fixtures/labsAndTests.json';

describe('Medical Records View LabsAndTestsListPage ', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(4, labsAndTests.entry[7]);
  });

  it('Toggle Menu button Print or download ', () => {
    // should display a toggle menu button

    MicrobiologyDetailsPage.verifyPrintOrDownload();
    MicrobiologyDetailsPage.clickPrintOrDownload();

    // should display print button for a Details "Print this Details"
    MicrobiologyDetailsPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    MicrobiologyDetailsPage.verifyDownloadPDF();

    // should display a download text file button "Download Details as a text file"
    MicrobiologyDetailsPage.verifyDownloadTextFile();

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
