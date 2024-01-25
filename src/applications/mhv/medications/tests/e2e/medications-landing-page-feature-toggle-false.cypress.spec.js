import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Landing Page', () => {
  it('visits Medications landing Page', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    site.login(true, false);
    landingPage.visitLandingPageURL();

    cy.url().should('include', '/my-health/medications/about');

    site.login(true, true);
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
