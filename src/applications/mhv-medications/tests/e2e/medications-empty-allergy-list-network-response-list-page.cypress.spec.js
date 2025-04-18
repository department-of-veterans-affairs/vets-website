import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Empty Allergy List Response', () => {
  it('visits Medications List Page Zero Allergies List', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const allergyListed = 0;
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyZeroAllergiesOnNetworkResponseForUserWithNoAllergies(
      allergyListed,
    );
  });
});
