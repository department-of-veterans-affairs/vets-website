import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import ConditionDetailsPage from './pages/ConditionDetailsPage';
import ConditionsListPage from './pages/ConditionsListPage';

describe('Medical Records Health Conditions', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    cy.visit('my-health/medical-records/Conditions');
  });

  it('Health Conditions Toggle Menu button Print or download ', () => {
    // Given Navigate to Health Conditions List Page

    ConditionsListPage.clickConditionsDetailsLink(0);

    // should display a toggle menu button
    ConditionDetailsPage.verifyPrintOrDownload();
    ConditionDetailsPage.clickPrintOrDownload();

    // should display print button for a list "Print this list"
    ConditionDetailsPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    ConditionDetailsPage.verifyDownloadPDF();

    // should display a download text file button "Download list as a text file"
    ConditionDetailsPage.verifyDownloadTextFile();

    ConditionDetailsPage.clickDownloadPDFFile();
    // cy.readFile(`${Cypress.config('downloadsFolder')}/radiology_report.pdf`);

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
