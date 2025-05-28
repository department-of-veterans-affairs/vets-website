import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import unknownRx from './fixtures/unknown-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications Details Page Unknown Status DropDown', () => {
  it('visits Medications Details Page Unknown Status DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 7;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(unknownRx, cardNumber);
    detailsPage.verifyPrescriptionsStatus('Unknown');
    detailsPage.clickWhatDoesThisStatusMeanDropDown();
    detailsPage.verifyUnknownStatusDropDownDefinition();
  });
});
