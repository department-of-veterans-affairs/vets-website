import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import ConditionsListPage from './pages/ConditionsListPage';
// import LabsAndTestsListPage from './pages/LabsAndTestsListPage';

describe('Medical Records Health Conditions', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    cy.visit('my-health/medical-records/Conditions');
  });

  it('Health Conditions Toggle Menu button Print or download ', () => {
    // Given Navigate to Health Conditions List Page

    ConditionsListPage.clickConditionsDetailsLink();

    // should display a toggle menu button
    ConditionsListPage.verifyPrintOrDownload();

    // should display print button for a list "Print this list"
    ConditionsListPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    ConditionsListPage.verifyDownloadPDF();

    // should display a download text file button "Download list as a text file"
    ConditionsListPage.verifyDownloadTextFile();

    // ConditionsListPage.clickDownloadPDFFile();
    // cy.readFile(`${Cypress.config('downloadsFolder')}/radiology_report.pdf`);

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
