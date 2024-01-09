import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsDetailsPage from './pages/LabsAndTestsDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';

describe('Medical Records All Domain Txt File From Dropdown', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    cy.visit('my-health/medical-records/');
  });

  it('Chemistry And Hematology Domain Txt File From Dropdown', () => {
    // Given Navigate to Chemistry And Hematology ListPage
    cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(0);
    LabsAndTestsDetailsPage.clickPrintOrDownload();
    // should display a toggle menu button
    LabsAndTestsDetailsPage.verifyPrintOrDownload();
    // should display print button for a Details "Print this Details"
    LabsAndTestsDetailsPage.verifyPrintButton();
    // should display a download pdf file button "Download PDF of this page"
    LabsAndTestsDetailsPage.verifyDownloadPDF();
    // should display a download text file button "Download Details as a text file"
    LabsAndTestsDetailsPage.verifyDownloadTextFile();

    // Given Navigate to Care summaries and notes Domain Page
    cy.visit('my-health/medical-records/summaries-and-notes');
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(0);
    LabsAndTestsDetailsPage.clickPrintOrDownload();
    // should display a toggle menu button
    LabsAndTestsDetailsPage.verifyPrintOrDownload();
    // should display print button for a Details "Print this Details"
    LabsAndTestsDetailsPage.verifyPrintButton();
    // should display a download pdf file button "Download PDF of this page"
    LabsAndTestsDetailsPage.verifyDownloadPDF();
    // should display a download text file button "Download Details as a text file"
    LabsAndTestsDetailsPage.verifyDownloadTextFile();

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
