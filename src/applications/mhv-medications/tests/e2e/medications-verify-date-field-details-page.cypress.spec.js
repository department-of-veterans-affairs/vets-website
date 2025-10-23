import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import rxList from './fixtures/listOfPrescriptions.json';

describe('verify navigation to medication details Page Date Field', () => {
  it('verify Medications details Page date field', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    detailsPage.clickMedicationHistoryAndDetailsLink(mockPrescriptionDetails);
    detailsPage.verifyPrescriptionsExpirationDate('April 14, 2024');
    detailsPage.verifyPrescriptionsOrderedDate();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
