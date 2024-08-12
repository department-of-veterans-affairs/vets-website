import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Allergies', () => {
  it('visits Medications List Page Allergies Network Response', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    const valueCode = 'h';
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLinkForUserWithAllergies();
    listPage.verifyAllergiesListNetworkResponseWithAllergyTypeReported(
      valueCode,
      0,
    );
  });
});
