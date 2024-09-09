import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/listOfPrescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';

describe('Medications Refill Page Shipped On Information', () => {
  it('visits Medications Refill Page Renew Section Shipped On Information', () => {
    const site = new MedicationsSite();
    const refillPage = new MedicationsRefillPage();
    const shippedDate = 'September 24, 2023';
    site.login();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    cy.get('@refillList')
      .its('response')
      .then(res => {
        expect(res.body.data[15].attributes).to.include({
          dispensedDate: shippedDate,
        });
      });
    refillPage.verifyShippedRxInformationOnRenewSectionRefillsPage(shippedDate);
  });
});
