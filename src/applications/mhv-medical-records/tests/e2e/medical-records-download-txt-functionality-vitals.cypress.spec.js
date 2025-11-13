import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';

describe('Medical Records Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Vitals Page Toggle Menu button Print or download ', () => {
    // Given Navigate to Vitals Page
    VitalsListPage.goToVitals();
    VitalsListPage.clickLinkByRecordListItem('Blood pressure');
    // should display a toggle menu button
    // Verify  PrintDownload button
    VitalsListPage.verifyPrintOrDownload();
    // Click PrintDownload button
    VitalsListPage.clickPrintOrDownload();
    // should display print button for a list "Print this list"
    VitalsListPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    VitalsListPage.verifyDownloadPDF();

    // should display a download text file button "Download a text file (.txt) of this list"
    VitalsListPage.verifyDownloadTextFile();

    // PathologyListPage.clickDownloadPDFFile();
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
