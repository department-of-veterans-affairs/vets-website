import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/list-refillable-prescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import ActiveParkedWithRefills from './fixtures/active-parked-rx-with-refills-remaining-on-refill-page.json';

describe('Medications Refill Page Active Parked Rx', () => {
  it('visits Medications Refill Page Active Parked Rx With Refills', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();

    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.verifyActiveParkedRxWithRefillsRemainingIsRefillableOnRefillPage();
    refillPage.verifyActiveParkedRxWithRefillsRemainingIsDisplayedOnRefillPage();
    refillPage.verifyRefillsRemainingForActiveParkedRxOnRefillPage(
      ActiveParkedWithRefills.data.attributes.prescriptionNumber,
      ActiveParkedWithRefills.data.attributes.refillRemaining,
    );
  });
});
