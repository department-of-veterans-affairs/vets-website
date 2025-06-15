import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Allergies Observed', () => {
  it('visits Medications List Page Allergies Network Response', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const valueCode = 'o';
    site.login();
    listPage.visitMedicationsListForUserWithAllergies();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyAllergiesListNetworkResponseWithAllergyTypeObserved(
      valueCode,
      1,
      0,
    );
  });
});
