import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import MicrobiologyListPage from './pages/MicrobiologyListPage';
// import LabsAndTestsListPage from './pages/LabsAndTestsListPage';

describe('Medical Records View LabsAndTestsListPage ', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    cy.visit('my-health/medical-records/labs-and-tests/');
    // LabsAndTestsListPage.clickGotoLabsAndTestsLink();
    // Given Navigate to Microbiology Page
    MicrobiologyListPage.clickMicrobiologyDetailsLink();
  });

  it('Toggle Menu button Print or download ', () => {
    // should display a toggle menu button
    MicrobiologyListPage.verifyPrintOrDownload();

    // should display print button for a list "Print this list"
    MicrobiologyListPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    MicrobiologyListPage.verifyDownloadPDF();

    // should display a download text file button "Download list as a text file"
    MicrobiologyListPage.verifyDownloadTextFile();

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
