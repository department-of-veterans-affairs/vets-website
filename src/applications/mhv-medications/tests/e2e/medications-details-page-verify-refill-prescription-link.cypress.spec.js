import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/active-prescriptions-with-refills.json';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import prescriptions from './fixtures/refill-page-prescription-requests.json';

describe('verify details page link to refill prescription', () => {
  it('verify Medications details Page Link to refill prescription', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const refillsPage = new MedicationsRefillPage();
    const cardNumber = 2;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    detailsPage.clickMedicationDetailsLink(mockPrescriptionDetails, cardNumber);
    refillsPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillsPage.verifyRefillPageTitle();
  });
});
