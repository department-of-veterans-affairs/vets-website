import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import { Data } from './utils/constants';

describe('Medications Download PDF no alert after navigating away from Med List Page', () => {
  const site = new MedicationsSite();
  const listPage = new MedicationsListPage();
  const detailsPage = new MedicationsDetailsPage();
  beforeEach(() => {
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    listPage.clickPrintOrDownloadThisListDropDown();
    listPage.verifyFocusOnPrintDownloadDropDownButton();
  });
  it('visits download pdf no alert after navigating away from list page', () => {
    listPage.clickDownloadListAsPDFButtonOnListPage();
    listPage.verifyFocusOnDownloadAlertSuccessBanner();
    listPage.verifyDownloadCompleteSuccessMessageBanner(
      Data.DOWNLOAD_SUCCESS_ALERT_CONTENT,
    );

    site.verifyDownloadedPdfFile('VA-medications-list-Safari-Mhvtp', '');
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    listPage.verifyDownloadSuccessMessageBannerNotVisibleAfterReload();
    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('visits download txt no alert after navigating away from list page', () => {
    listPage.clickDownloadListAsTxtButtonOnListPage();
    // listPage.verifyLoadingSpinnerForDownloadOnListPage();
    listPage.verifyFocusOnDownloadAlertSuccessBanner();
    listPage.verifyDownloadCompleteSuccessMessageBanner(
      Data.DOWNLOAD_SUCCESS_ALERT_CONTENT,
    );
    listPage.verifyDownloadTextFileHeadless('Safari', 'Mhvtp', 'Mhvtp, Safari');
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    listPage.verifyDownloadSuccessMessageBannerNotVisibleAfterReload();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
