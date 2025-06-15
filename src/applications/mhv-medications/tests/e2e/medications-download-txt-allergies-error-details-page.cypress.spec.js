import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';

describe('Medications Details Page Download Txt Error when Allergies API call Fails', () => {
  it('visits Medications Details Page Download Txt Error When API Call Fails', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsLinkWhenNoAllergiesAPICallFails();
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    listPage.clickPrintOrDownloadThisListDropDown();
    detailsPage.clickDownloadMedicationsDetailsAsTxtOnDetailsPage();
    listPage.verifyFocusOnDownloadFailureAlertBanner();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
