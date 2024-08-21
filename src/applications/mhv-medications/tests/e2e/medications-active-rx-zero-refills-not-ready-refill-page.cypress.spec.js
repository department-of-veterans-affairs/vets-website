import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/list-refillable-prescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import activeRxZeroRefills from './fixtures/active-rx-zero-refills-on-refill-page.json';

describe('Medications Refill Page Active Rx No Refills', () => {
  it('visits Medications Refill Page Active Rx Zero Refills Remaining', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const listNumber = 3;
    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.clickMedicationInRenewSection(activeRxZeroRefills, listNumber);
    refillPage.verifyActiveRxZeroRefillsStatus(
      activeRxZeroRefills.data.attributes.dispStatus,
    );
    refillPage.verifyRefillsRemainingForActiveRxZeroRefills(
      activeRxZeroRefills.data.attributes.refillRemaining,
    );
  });
});
