import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/list-refillable-prescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import activeParkedNoDispenseDate from './fixtures/active-parked-zero-refills-null-dispense-date.json';

describe('Medications Refill Page Active Parked Rx', () => {
  it('visits Medications Refill Page Active Parked Rx With Zero Refills', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const checkBox = 10;
    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.verifyActiveRxZeroRefillsNoDispenseDateIsRefillableOnRefillPage(
      checkBox,
    );
    refillPage.verifyNullDispenseDateForActiveParkedZeroRefills(
      activeParkedNoDispenseDate.data.attributes.dispensedDate,
    );
    refillPage.verifyRefillRemainingForActiveParkedRxZeroRefills(
      checkBox,
      activeParkedNoDispenseDate.data.attributes.refillRemaining,
    );
  });
});
