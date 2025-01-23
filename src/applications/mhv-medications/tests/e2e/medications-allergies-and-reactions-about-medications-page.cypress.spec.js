import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Allergies and Reactions Link on Medications Landing Page', () => {
  it('visits allergies and reactions link on landing page', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    landingPage.clickExpandAccordionsOnMedicationsLandingPage();
    landingPage.verifyGoToYourAllergiesAndReactionsLinkOnAboutMedicationsPage();
  });
});
