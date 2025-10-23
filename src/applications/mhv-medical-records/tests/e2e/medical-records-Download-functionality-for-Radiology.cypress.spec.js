import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import RadiologyDetailsPage from './pages/RadiologyDetailsPage';

describe('Medical Records Download Functionality For Radiology', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    site.loadPage();
  });

  it('Visits Medical Records View Labs And Tests Details', () => {
    // const site = new MedicalRecordsSite();
    // site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
    // Navigate to radiology page
    LabsAndTestsListPage.clickRadiologyDetailsLink('CHEST 2 VIEWS PA&LAT');

    // should display a toggle menu button
    RadiologyDetailsPage.verifyPrintOrDownload();
    RadiologyDetailsPage.clickPrintOrDownload();
    // should display print button for a list "Print this list"
    RadiologyDetailsPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    RadiologyDetailsPage.verifyDownloadPDF();

    // should display a download text file button "Download a text file (.txt) of this list"
    RadiologyDetailsPage.verifyDownloadTextFile();
    RadiologyDetailsPage.clickDownloadPDFFile();

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
