import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/older-prescription-details.json';
import rxList from './fixtures/grouped-prescriptions-list.json';
import { Data } from './utils/constants';

describe('Medications Details Page Download TXT Refill History field', () => {
  it('visits Details Page Download Txt Refill History Med Description', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    listPage.clickPrintOrDownloadThisListDropDown();
    detailsPage.verifyFocusOnPrintOrDownloadDropdownButtonOnDetailsPage();
    detailsPage.clickDownloadMedicationsDetailsAsTxtOnDetailsPage();
    listPage.verifyDownloadCompleteSuccessMessageBanner(
      Data.DOWNLOAD_SUCCESS_ALERT_CONTENT,
    );
    listPage.verifyFocusOnDownloadAlertSuccessBanner();
    // detailsPage.verifyMedicationDescriptionInTxtDownload(
    //   Data.DOWNLOAD_TXT_REFILL_HISTORY,
    // );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
