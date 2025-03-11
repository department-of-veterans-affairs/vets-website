import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import expiredRx from './fixtures/expired-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import rxList from './fixtures/listOfPrescriptions.json';

describe('Medications Details Page Expired Status DropDown', () => {
  it('visits Medications Details Page Expired Status DropDown', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 15;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(expiredRx, cardNumber);
    detailsPage.clickWhatDoesThisStatusMeanDropDown();
    detailsPage.verifyExpiredStatusDropDownDefinition();
  });
});
