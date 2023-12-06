import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import VitalsDetailsPage from './pages/VitalsDetailsPage';

describe('Medical Records Health VitalsListPage', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    cy.visit('my-health/medical-records/vitals');
  });

  it('Vitals ListPage Toggle Menu button Print or download ', () => {
    // Given Navigate to Vitals ListPage

    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(0);

    // should display a toggle menu button
    VitalsDetailsPage.verifyPrintOrDownload();
    VitalsDetailsPage.clickPrintOrDownload();

    // should display print button for a Details "Print this Details"
    VitalsDetailsPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    VitalsDetailsPage.verifyDownloadPDF();

    // should display a download text file button "Download Details as a text file"
    VitalsDetailsPage.verifyDownloadTextFile();

    VitalsDetailsPage.clickDownloadPDFFile();
    // cy.readFile(`${Cypress.config('downloadsFolder')}/Vitals_report.pdf`);

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
