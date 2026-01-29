import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import onHoldPrescriptionDetails from './fixtures/active-on-hold-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications Details Page Status DropDown', () => {
  it('visits Medications Details Page Active On Hold Status DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 10;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(
      onHoldPrescriptionDetails,
      cardNumber,
    );
    detailsPage.clickWhatDoesThisStatusMeanDropDown();
    detailsPage.verifyOnHoldStatusDropDownDefinition();
  });
});
