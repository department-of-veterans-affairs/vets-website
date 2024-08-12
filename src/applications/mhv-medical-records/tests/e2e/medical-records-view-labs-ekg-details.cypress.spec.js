import moment from 'moment-timezone';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import EKGDetailsPage from './pages/EKGDetailsPage';
import LabsAndTestsListPage from './pages/LabsAndTestsListPage';
import labsAndTests from '../fixtures/labsAndTests.json';

describe.skip('Medical Records View EKG Details', () => {
  const site = new MedicalRecordsSite();
  before(() => {
    site.login();
    // cy.visit('my-health/medical-records/labs-and-tests');
    LabsAndTestsListPage.goToLabsAndTests();
  });
  it('Navigate to EKG Details page, verify fields', () => {
    // Given As a Medical Records User I wanted to Navigate to "EKG" Detail Page
    LabsAndTestsListPage.clickLabsAndTestsDetailsLink(4, labsAndTests.entry[4]);
    EKGDetailsPage.verifyPrintOrDownload();
    EKGDetailsPage.clickPrintOrDownload();
    EKGDetailsPage.verifyPrintButton();
    EKGDetailsPage.verifyDownloadPDF();
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
    EKGDetailsPage.verifyTitle('Electrocardiogram (EKG)');
    EKGDetailsPage.verifyDate('December 14, 2000, 11:35 a.m.');
    EKGDetailsPage.verifyOrderingLocation('school parking lot');
    EKGDetailsPage.verifyResults();
    cy.injectAxe();
    cy.axeCheck('main', {});
  });
});
