import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Allergies Observed Historic URL', () => {
  it('visits Medications List Page Allergies Network Response URL', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    const url = 'allergyObservedHistoric';
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLinkForUserWithAllergies();
    listPage.verifyAllergiesListNetworkResponseURL(url, 0);
  });
});
