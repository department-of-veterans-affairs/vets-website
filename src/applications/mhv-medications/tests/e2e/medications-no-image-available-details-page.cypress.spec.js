import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import activeRxNoImage from './fixtures/active-prescriptions-with-refills.json';

describe('Medications Refill History No Image on Details Page', () => {
  it('visits prescription refill history No Medication Image on details page', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 2;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyCmopNdcNumberIsNull();
    detailsPage.clickMedicationDetailsLink(activeRxNoImage, cardNumber);
    detailsPage.verifyNoImageFieldMessageOnDetailsPage();
  });
});
