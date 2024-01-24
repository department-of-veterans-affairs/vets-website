import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';

describe('Medical Records Download Functionality For Radiology', () => {
  it('Visits Medical Records View Labs And Tests Details', () => {
    const site = new MedicalRecordsSite();
    site.login();
    // Given Navigate to Radiology Page
    cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(4);

    // should display a toggle menu button
    LabsAndTestsListPage.verifyPrintOrDownload();

    // should display print button for a list "Print this list"
    LabsAndTestsListPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    LabsAndTestsListPage.verifyDownloadPDF();

    // should display a download text file button "Download a text file (.txt) of this list"
    LabsAndTestsListPage.verifyDownloadTextFile();
    LabsAndTestsListPage.clickDownloadPDFFile();

    // cy.readFile(`${Cypress.config('downloadsFolder')}/radiology_report.pdf`);

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
