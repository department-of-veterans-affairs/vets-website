import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Allergies Reported Org Name', () => {
  it('visits Medications List Page Allergies Network Response Org Name', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const orgName = 'SLC10 TEST LAB';
    site.login();
    listPage.visitMedicationsListForUserWithAllergies();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyAllergiesListContainedResourceOrgName(orgName, 0);
  });
});
