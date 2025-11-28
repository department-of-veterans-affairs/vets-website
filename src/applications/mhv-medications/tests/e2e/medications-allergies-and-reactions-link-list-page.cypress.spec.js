import MedicationsSite from './med_site/MedicationsSite';
import prescriptionList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Allergies Link', () => {
  it('visits Medications List Page Allergies And Reactions Link', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(prescriptionList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyAllergiesAndReactionsLinkOnMedicationsListPage();
  });

  it('visits Medications List Page Allergies And Reactions Link with Accelerated allergies', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login(true, true);
    listPage.visitMedicationsListPageURL(prescriptionList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyAllergiesAndReactionsLinkOnMedicationsListPage();
  });
});
