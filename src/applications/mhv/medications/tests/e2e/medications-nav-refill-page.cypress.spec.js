import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/prescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';

describe('Medications Refill Page', () => {
  it('visits Medications Refill Page', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();

    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
  });
});
