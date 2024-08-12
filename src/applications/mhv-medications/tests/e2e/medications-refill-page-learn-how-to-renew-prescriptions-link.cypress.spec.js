import MedicationsSite from './med_site/MedicationsSite';
import refillPrescriptions from './fixtures/refill-page-prescription-requests.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Refill Page Renew Rx', () => {
  it('visits Medications Refill Page Renew Rx Link', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const landingPage = new MedicationsLandingPage();

    site.login();
    refillPage.loadRefillPage(refillPrescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.clickLearnHowToRenewPrescriptionsLink();
    landingPage.verifyHowtoRenewPrescriptionsAccordionDropDown();
  });
});
