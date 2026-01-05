import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import rxList from './fixtures/listOfPrescriptions.json';
import { Data } from './utils/constants';

describe('Medications Details Page Download', () => {
  it('visits Medications Details Page Download PDF Dropdown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    listPage.clickPrintOrDownloadThisListDropDown();
    detailsPage.verifyFocusOnPrintOrDownloadDropdownButtonOnDetailsPage();
    detailsPage.verifyDownloadMedicationsDetailsAsPDFButtonOnDetailsPage();
    detailsPage.clickDownloadMedicationDetailsAsPdfOnDetailsPage();
    listPage.verifyDownloadCompleteSuccessMessageBanner(
      Data.DOWNLOAD_SUCCESS_ALERT_CONTENT,
    );
    listPage.verifyFocusOnDownloadAlertSuccessBanner();
    site.verifyDownloadedFile({
      prefixString: 'VA-medications-details-Safari-Mhvtp',
    });
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
