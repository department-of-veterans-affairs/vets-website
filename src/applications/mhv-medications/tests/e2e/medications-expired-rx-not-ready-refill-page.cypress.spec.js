import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/list-refillable-prescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import expiredRx from './fixtures/expired-prescription-details.json';

describe('Medications Refill Page Renew Section', () => {
  it('visits Medications Refill Page Expired Rx Renew on Refill Page', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const listNumber = 1;
    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.verifyRxRenewSectionSubHeadingOnRefillPage();
    refillPage.clickMedicationInRenewSection(expiredRx, listNumber);
    refillPage.verifyExpiredRxOnRenewSection(
      expiredRx.data.attributes.dispStatus,
    );
  });
});
