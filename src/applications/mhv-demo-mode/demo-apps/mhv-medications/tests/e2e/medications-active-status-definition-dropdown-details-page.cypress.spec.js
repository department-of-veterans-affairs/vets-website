import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import prescriptionRefillDetails from './fixtures/prescription-refill-button-details-page.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications Details Page Status DropDown', () => {
  it('visits Medications Details Page Active Status DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 1;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(
      prescriptionRefillDetails,
      cardNumber,
    );
    detailsPage.clickWhatDoesThisStatusMeanDropDown();
    detailsPage.verifyActiveStatusDropDownDefinition();
  });
});
