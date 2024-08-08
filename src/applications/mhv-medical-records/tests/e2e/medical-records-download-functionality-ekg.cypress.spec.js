import moment from 'moment-timezone';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import EKGDetailsPage from './pages/EKGDetailsPage';
import labsAndTests from '../fixtures/labsAndTests.json';

describe.skip('Medical Records Labs and Tests List Page', () => {
  const site = new MedicalRecordsSite();

  before(() => {
    site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
  });

  it('EKG Details page Toggle Menu button Print or download ', () => {
    // Given Navigate to EKG Details Page

    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(3, labsAndTests.entry[3]);

    // should display a toggle menu button
    EKGDetailsPage.verifyPrintOrDownload();
    EKGDetailsPage.clickPrintOrDownload();

    // should display print button for a Details "Print this Details"
    EKGDetailsPage.verifyPrintButton();

    // should display a download pdf file button "Download PDF of this page"
    EKGDetailsPage.verifyDownloadPDF();

    // should display a download text file button "Download Details as a text file"
    EKGDetailsPage.verifyDownloadTextFile();

    EKGDetailsPage.clickDownloadPDFFile();
    // cy.readFile(`${Cypress.config('downloadsFolder')}/Pathology_report.pdf`);
    site.verifyDownloadedPdfFile(
      'VA-labs-and-tests-Details-Mhvtp',
      moment(),
      '',
    );

    EKGDetailsPage.clickPrintOrDownload();
    EKGDetailsPage.clickDownloadTxtFile();

    site.verifyDownloadedTxtFile(
      'VA-labs-and-tests-details-Safari-Mhvtp',
      moment(),
      '',
    );
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
