import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import VitalsListPage from './pages/VitalsListPage';
import VitalsDetailsPage from './pages/VitalsDetailsPage';

describe('Medical Records Vitals', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Vitals Page Toggle Menu button Print or download ', () => {
    // Given Navigate to Vitals Page
    VitalsListPage.goToVitals();
    VitalsListPage.clickLinkByRecordListItem('Blood pressure');
    // Now on detail page - use VitalsDetailsPage for print/download actions
    // should display a toggle menu button
    // Verify  PrintDownload button
    VitalsDetailsPage.verifyPrintOrDownload();
    // Click PrintDownload button
    VitalsDetailsPage.clickPrintOrDownload();
    // should display print button for a list "Print this list"
    VitalsDetailsPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    VitalsDetailsPage.verifyDownloadPDF();

    // should display a download text file button "Download a text file (.txt) of this list"
    VitalsDetailsPage.verifyDownloadTextFile();

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
