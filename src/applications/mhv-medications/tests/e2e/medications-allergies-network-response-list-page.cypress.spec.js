import MedicationsSite from './med_site/MedicationsSite';
import cernerUser from './fixtures/cerner-user.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Allergies', () => {
  it('visits Medications List Page Allergies Network Response', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const valueCode = 'h';
    site.login();
    listPage.visitMedicationsListForUserWithAllergies();
    listPage.verifyAllergiesListNetworkResponseWithAllergyTypeReported(
      valueCode,
      0,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('visits Medications List Page Cerner Allergies Network Response', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login(true, cernerUser);
    listPage.visitMedicationsListForCernerUser();
    listPage.verifyAllergiesListNetworkResponseForCernerUser();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
