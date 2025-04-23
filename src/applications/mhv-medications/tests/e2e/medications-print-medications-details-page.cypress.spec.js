import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Navigate to Print DropDown on Details Page', () => {
  it('verify print dropdown on medications details page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickPrintOrDownloadThisPageDropDownOnDetailsPage();
    detailsPage.verifyPrintButtonEnabledOnDetailsPage();
  });
});
