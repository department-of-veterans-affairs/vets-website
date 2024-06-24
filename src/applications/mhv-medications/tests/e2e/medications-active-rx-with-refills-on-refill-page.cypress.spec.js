import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/list-refillable-prescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import activeRxWithRefills from './fixtures/active-rx-with-refills-remaining-on-refill-page.json';

describe('Medications Refill Page with Active Rx', () => {
  it('visits Medications Refill Page Active Rx With Refills Remaining', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const checkBox = 0;
    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.verifyActiveRxWithRefillsRemainingIsRefillableOnRefillPage(
      checkBox,
    );
    refillPage.verifyActiveRxStatusOnRefillPage(
      activeRxWithRefills.data.attributes.refillStatus,
    );
    refillPage.verifyRefillsRemainingForActiveRxOnRefillPage(
      checkBox,
      activeRxWithRefills.data.attributes.refillRemaining,
    );
  });
});
