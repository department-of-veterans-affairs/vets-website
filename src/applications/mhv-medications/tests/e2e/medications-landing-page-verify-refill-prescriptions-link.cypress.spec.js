import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import prescriptions from './fixtures/refill-page-prescription-requests.json';

describe('Medications Landing Page Refill Prescriptions Link', () => {
  it('visits Medications landing Page Refill Prescriptions Link', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    const refillPage = new MedicationsRefillPage();
    site.login();
    landingPage.visitLandingPageURL();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
  });
});
