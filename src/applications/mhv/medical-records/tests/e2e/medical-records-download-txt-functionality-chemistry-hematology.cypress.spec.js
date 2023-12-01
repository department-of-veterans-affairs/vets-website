import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';

describe('Medical Records Health Chemistry And Hematology', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    cy.visit('my-health/medical-records/labs-and-tests');
  });

  it('Chemistry And Hematology  ListPage Toggle Menu button Print or download ', () => {
    // Given Navigate to Chemistry And Hematology ListPage

    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(0);

    // should display a toggle menu button
    LabsAndTestsListPage.verifyPrintOrDownload();

    // should display print button for a list "Print this list"
    LabsAndTestsListPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    LabsAndTestsListPage.verifyDownloadPDF();

    // should display a download text file button "Download list as a text file"
    LabsAndTestsListPage.verifyDownloadTextFile();

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
