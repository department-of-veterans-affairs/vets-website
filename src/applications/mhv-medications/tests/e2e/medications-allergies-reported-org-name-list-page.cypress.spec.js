import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Allergies Reported Org Name', () => {
  it('visits Medications List Page Allergies Network Response Org Name', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    const orgName = 'SLC10 TEST LAB';
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLinkForUserWithAllergies();
    listPage.verifyAllergiesListContainedResourceOrgName(orgName, 0);
  });
});
