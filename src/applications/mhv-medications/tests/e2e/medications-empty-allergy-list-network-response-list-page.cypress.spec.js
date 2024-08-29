import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Empty Allergy List Response', () => {
  it('visits Medications List Page Zero Allergies List', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    const allergyListed = 0;
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.verifyZeroAllergiesOnNetworkResponseForUserWithNoAllergies(
      allergyListed,
    );
  });
});
