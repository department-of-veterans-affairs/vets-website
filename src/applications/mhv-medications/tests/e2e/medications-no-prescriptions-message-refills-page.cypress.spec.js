import MedicationsSite from './med_site/MedicationsSite';
import noPrescriptions from './fixtures/empty-prescriptions-list.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';

describe('Medications Refill Page No Prescriptions', () => {
  it('visits Medications Refill Page Message for No Prescriptions on Refill Page', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();

    site.login();
    refillPage.loadRefillPage(noPrescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.verifyNoMedicationsAvailableMessageOnRefillPage();
  });
});
