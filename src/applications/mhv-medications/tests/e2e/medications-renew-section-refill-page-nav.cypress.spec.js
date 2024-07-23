import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/renew-refill-prescription.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';

describe('Medications Renew Section on Refill Page', () => {
  it('visits Medications Renew Section on Refill Page', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const listLength = 23;
    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.verifyRenewableSectionHeaderOnRefillPage();
    refillPage.verifyRenewListCountonRefillPage(1, 20, listLength);
  });
});
