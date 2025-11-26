import MedicalRecordsSite from './mr_site/MedicalRecordsSite';
import DownloadReportsPage from './pages/DownloadReportsPage';
import selfEnteredResponse from './fixtures/selfEnteredResponse.json';
import { currentDateAddSecondsForFileDownload } from '../../util/dateHelpers';

describe('Medical Records download page', () => {
  const site = new MedicalRecordsSite();

  beforeEach(() => {
    site.login();
  });

  it('Verifies self-entered download', () => {
    // const site = new MedicalRecordsSite();
    // site.login();
    // site.loadPage();

    DownloadReportsPage.goToReportsPage();

    DownloadReportsPage.clickSelfEnteredAccordionItem();

    DownloadReportsPage.verifySelfEnteredDownloadButton();

    DownloadReportsPage.clickDownloadSelfEnteredButton(selfEnteredResponse);

    DownloadReportsPage.verifySelfEnteredDownloadStartedAlert();

    site.verifyDownloadedPdfFile(
      'VA-Blue-Button-report-Safari-Mhvtp',
      currentDateAddSecondsForFileDownload(1),
      '',
    );

    // Axe check
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
