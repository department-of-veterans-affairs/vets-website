import MedicationsSite from './med_site/MedicationsSite';
import refillPrescriptions from './fixtures/refill-page-prescription-requests.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';

describe('Medications Submit Refill Request With No Rx', () => {
  it('visits Medications Error Message Submit Refill Request With No Rx', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();

    site.login();
    refillPage.loadRefillPage(refillPrescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.clickRefillRequestButton();
    refillPage.verifyErrorMessageWhenRefillRequestWithoutSelectingPrescription();
  });
});
