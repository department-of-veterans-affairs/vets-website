import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import submittedRx from './fixtures/active-submitted-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications Details Page Active Submitted Status DropDown', () => {
  it('visits Medications Details Page Active Submitted Status DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 4;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(submittedRx, cardNumber);
    detailsPage.clickWhatDoesThisStatusMeanDropDown();
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.verifySubmittedStatusDropDownDefinition();
  });
});
