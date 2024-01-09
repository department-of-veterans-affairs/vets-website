import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';

describe('Medical Records Labs And Tests Print or download  ', () => {
  it('Visits Medical Records View Labs And Tests button Print or download ', () => {
    const site = new MedicalRecordsSite();
    site.login();
    // Given Navigate to Radiology Page
    cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.clickLabsAndTestsRadiologyLink();

    // Verify Details Page PrintDownload button
    LabsAndTestsListPage.verifyPrintOrDownload('Print or download');

    // Click Details Page PrintDownload button
    LabsAndTestsListPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    LabsAndTestsListPage.verifyDownloadPDF();

    // should display a download text file button "Download a text file (.txt) of this list"
    LabsAndTestsListPage.verifyDownloadTextFile();
    LabsAndTestsListPage.clickDownloadPDFFile();
    cy.readFile(`${Cypress.config('downloadsFolder')}/radiology_report.pdf`);

    // Axe check
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
