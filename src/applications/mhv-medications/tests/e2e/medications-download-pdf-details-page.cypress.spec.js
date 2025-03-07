import moment from 'moment-timezone';
import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import rxList from './fixtures/listOfPrescriptions.json';

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
    detailsPage.verifyLoadingSpinnerForDownloadOnDetailsPage();
    listPage.verifyDownloadCompleteSuccessMessageBanner();
    detailsPage.verifyFocusOnPrintOrDownloadDropdownButtonOnDetailsPage();
    site.verifyDownloadedPdfFile(
      'VA-medications-list-Safari-Mhvtp',
      moment(),
      '',
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
