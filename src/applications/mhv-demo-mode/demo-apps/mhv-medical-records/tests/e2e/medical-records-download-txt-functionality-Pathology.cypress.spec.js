import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import PathologyDetailsPage from './pages/PathologyDetailsPage';
import labsAndTests from './fixtures/labs-and-tests/labsAndTests.json';

describe('Medical Records Health PathologyListPage', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
  });

  it('Pathology ListPage Toggle Menu button Print or download ', () => {
    // Given Navigate to Pathology ListPage

    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(5, labsAndTests.entry[8]);

    // should display a toggle menu button
    PathologyDetailsPage.verifyPrintOrDownload();
    PathologyDetailsPage.clickPrintOrDownload();

    // should display print button for a Details "Print this Details"
    PathologyDetailsPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    PathologyDetailsPage.verifyDownloadPDF();

    // should display a download text file button "Download Details as a text file"
    PathologyDetailsPage.verifyDownloadTextFile();

    PathologyDetailsPage.clickDownloadPDFFile();
    // cy.readFile(`${Cypress.config('downloadsFolder')}/Pathology_report.pdf`);

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'link-name': {
          enabled: false,
        },
      },
    });
  });
});
