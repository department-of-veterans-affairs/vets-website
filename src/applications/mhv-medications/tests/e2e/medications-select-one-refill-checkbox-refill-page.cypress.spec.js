import MedicationsSite from './med_site/MedicationsSite';
import refillPrescriptions from './fixtures/single-refill-prescription-request.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';

describe('Medications Select One Refill', () => {
  it('visits Medications Refill Page Select Single Refill', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();

    const numberOfRefills = 1;
    site.login();
    refillPage.loadRefillPage(refillPrescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.clickOneRefillCheckBoxOnRefillPage();
    refillPage.verifyRequestRefillsButtonExistsForOneRefill(numberOfRefills);
  });
});
