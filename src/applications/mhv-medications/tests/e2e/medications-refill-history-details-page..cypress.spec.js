import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import refillHistoryDetails from './fixtures/prescription-tracking-details.json';

describe('Medications Refill History on Details Page', () => {
  it('visits prescription refill history on details page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 16;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(refillHistoryDetails, cardNumber);
    detailsPage.verifyRefillHistoryHeaderOnDetailsPage();
    detailsPage.verifyFirstRefillHeaderTextOnDetailsPage();
    detailsPage.verifyShippedOnDateFieldOnDetailsPage();
    detailsPage.verifyNoImageFieldMessageOnDetailsPage();
  });
});
