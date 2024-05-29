import MedicationsSite from './med_site/MedicationsSite';
import refillPrescriptions from './fixtures/refill-page-prescription-requests.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';

describe('Medications Select All Refills', () => {
  it('visits Medications Refill Page Select Refills', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const checkboxes = 2;
    const numberOfRefills = 2;
    site.login();
    refillPage.loadRefillPage(refillPrescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifySelectAllRefillCheckBoxExists();
    refillPage.clickSelectAllRefillCheckBox();
    refillPage.verifyRequestRefillsButtonExists(numberOfRefills);
    refillPage.verifyRefillCheckBoxesClicked(checkboxes);
  });
});
