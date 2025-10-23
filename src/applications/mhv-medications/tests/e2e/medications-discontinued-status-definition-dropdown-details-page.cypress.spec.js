import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import discontinuedRx from './fixtures/discontinued-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications Details Page Discontinued Status DropDown', () => {
  it('visits Medications Details Page Discontinued Status DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 6;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(discontinuedRx, cardNumber);
    detailsPage.clickWhatDoesThisStatusMeanDropDown();
    detailsPage.verifyDiscontinuedStatusDropDownDefinition();
  });
});
