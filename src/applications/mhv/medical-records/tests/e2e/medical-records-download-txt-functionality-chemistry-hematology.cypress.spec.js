import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsDetailsPage from './pages/LabsAndTestsDetailsPage';
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
    LabsAndTestsDetailsPage.clickPrintOrDownload();
    // should display a toggle menu button
    LabsAndTestsDetailsPage.verifyPrintOrDownload();

    // should display print button for a Details "Print this Details"
    LabsAndTestsDetailsPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    LabsAndTestsDetailsPage.verifyDownloadPDF();

    // should display a download text file button "Download Details as a text file"
    LabsAndTestsDetailsPage.verifyDownloadTextFile();
    LabsAndTestsDetailsPage.clickDownloadTextFile();
    LabsAndTestsDetailsPage.verifyDownloadTextFileHeadless('Safari', 'Mhvtp');
    // cy.log(`downloads folder: ${downloadsFolder}`);
    // cy.pause();
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
