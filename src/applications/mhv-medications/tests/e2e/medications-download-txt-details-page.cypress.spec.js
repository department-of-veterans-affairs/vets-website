import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications Details Page Download', () => {
  it('visits Medications Details Page Download Txt Dropdown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    listPage.clickPrintOrDownloadThisListDropDown();
    detailsPage.verifyFocusOnPrintOrDownloadDropdownButtonOnDetailsPage();
    detailsPage.clickDownloadMedicationsDetailsAsTxtOnDetailsPage();
    listPage.verifyDownloadCompleteSuccessMessageBanner();
    detailsPage.verifyFocusOnPrintOrDownloadDropdownButtonOnDetailsPage();
    listPage.verifyDownloadTextFileHeadless('Safari', 'Mhvtp', 'Mhvtp, Safari');
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
