import MedicationsSite from './med_site/MedicationsSite';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Error Message for Refill Page API Call Failure ', () => {
  it('visits Medications Landing Page Error Message for Refill Page Call Failure', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.loadRefillPageForApiCallFailure();
    landingPage.verifyErroMessageforFailedAPICallListPage();
  });
});
