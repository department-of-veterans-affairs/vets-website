import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/listOfPrescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';

describe('Medications Refill Page Request Some Refills', () => {
  it('visits Medications Refill Page Request Some Refills', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const numberOfCheckboxes = 4;
    const totalRxCount = 7;
    const numberOfRefills = 3;
    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.verifyTotalRefillablePrescriptionsCount(totalRxCount);
    refillPage.clickSomeRefillCheckBoxesOnRefillPage(numberOfCheckboxes);
    refillPage.verifyRequestRefillsButtonExists(numberOfRefills);
  });
});
