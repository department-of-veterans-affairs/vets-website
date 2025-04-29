import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';

describe('Navigate to Print Error Message when Allergies API Fails on Details Page', () => {
  it('verify print error message when api call fails on medications details page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsLinkWhenNoAllergiesAPICallFails();
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickPrintOrDownloadThisPageDropDownOnDetailsPage();
    detailsPage.clickPrintThisPageButtonOnDetailsPage();
    listPage.verifyPrintErrorMessageForAllergiesAPICallFail();
  });
});
