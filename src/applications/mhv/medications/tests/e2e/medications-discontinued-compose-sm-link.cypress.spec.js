import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page DropDown -- discontinued SM Compose Link', () => {
  it('verifies content of compose message link on discontinued meds', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink(true);
    cy.get('[data-testid="discontinued-compose-message-link"]')
      .invoke('attr', 'href')
      .should('contain', 'myhealth.va.gov/mhv-portal-web/secure-messaging');
  });
});
