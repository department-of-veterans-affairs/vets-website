import moment from 'moment-timezone';
import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import DownloadReportsPage from './pages/DownloadReportsPage';
import selfEnteredResponse from './fixtures/selfEnteredResponse.json';

describe('Medical Records download page', () => {
  it('Verifies self-entered download', () => {
    const site = new MedicalRecordsSite();
    site.login();
    site.loadPage();

    DownloadReportsPage.goToReportsPage();

    DownloadReportsPage.clickSelfEnteredAccordionItem();

    DownloadReportsPage.verifySelfEnteredDownloadButton();

    DownloadReportsPage.clickDownloadSelfEnteredButton(selfEnteredResponse);

    DownloadReportsPage.verifySelfEnteredDownloadStartedAlert();

    site.verifyDownloadedPdfFile(
      'VA-Blue-Button-report-Safari-Mhvtp',
      moment(),
      '',
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
