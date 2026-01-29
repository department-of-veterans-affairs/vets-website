import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Allergies Observed Historic URL', () => {
  it('visits Medications List Page Allergies Network Response URL', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const url = 'allergyObservedHistoric';
    site.login();
    listPage.visitMedicationsListForUserWithAllergies();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyAllergiesListNetworkResponseURL(url, 0);
  });
});
