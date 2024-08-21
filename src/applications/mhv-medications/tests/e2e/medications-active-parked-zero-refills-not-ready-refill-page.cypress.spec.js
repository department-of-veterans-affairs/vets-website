import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/list-refillable-prescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import activeParkedWithZeroRefills from './fixtures/active-parked-zero-refills-with-dispense-date.json';

describe('Medications Refill Page Active Parked', () => {
  it('visits Medications Refill Page Active Parked Renew', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const listNumber = 2;
    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.clickMedicationInRenewSection(
      activeParkedWithZeroRefills,
      listNumber,
    );
    refillPage.verifyActiveParkedZeroRefillStatus(
      activeParkedWithZeroRefills.data.attributes.dispStatus,
    );
    refillPage.verifyActiveParkedZeroRefillsDispenseDate(
      activeParkedWithZeroRefills.data.attributes.dispensedDate,
    );
    refillPage.verifyRefillsRemainingForActiveParkedZeroRefills(
      activeParkedWithZeroRefills.data.attributes.refillRemaining,
    );
  });
});
