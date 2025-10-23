import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import ChemHemDetailsPage from './pages/ChemHemDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import labsAndTests from './fixtures/labs-and-tests/labsAndTests.json';

describe('Medical Records Health Chemistry And Hematology', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
  });

  it('Chemistry And Hematology  ListPage Toggle Menu button Print or download ', () => {
    // Given Navigate to Chemistry And Hematology ListPage

    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(3, labsAndTests.entry[1]);
    ChemHemDetailsPage.clickPrintOrDownload();
    // should display a toggle menu button
    ChemHemDetailsPage.verifyPrintOrDownload();

    // should display print button for a Details "Print this Details"
    ChemHemDetailsPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    ChemHemDetailsPage.verifyDownloadPDF();

    // should display a download text file button "Download Details as a text file"
    ChemHemDetailsPage.verifyDownloadTextFile();
    ChemHemDetailsPage.clickDownloadTxtFile();

    // // verify content of the downloaded text file when running in headless mode
    // ChemHemDetailsPage.verifyDownloadTextFileHeadless(
    //   'Safari',
    //   'Mhvtp',
    //   'Mhvtp, Safari',
    // );

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
