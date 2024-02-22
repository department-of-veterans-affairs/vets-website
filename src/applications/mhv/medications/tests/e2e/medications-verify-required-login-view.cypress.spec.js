import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Login View', () => {
  it('visits Medications Login View', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    site.login(false);
    site.verifyloadLogInModal();
    site.login();
    landingPage.visitLandingPageURL();

    cy.injectAxe();
    cy.axeCheck('main');
  });
});
