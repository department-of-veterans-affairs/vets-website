import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/renew-refill-prescription.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';

describe('Medications Renew Section Description on Refill Page', () => {
  it('visits Medications Renew Section Content Description on Refill Page', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();

    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.verifyRenewableSectionDescriptionOnRefillPage();
  });
});
