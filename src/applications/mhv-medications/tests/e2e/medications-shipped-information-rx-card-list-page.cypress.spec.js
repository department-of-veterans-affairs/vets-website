import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications List Page Shipped On Information', () => {
  it('visits Medications List Shipped Information on Rx Card', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    const shippedDate = 'September 24, 2023';
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    cy.get('@medicationsList')
      .its('response')
      .then(res => {
        expect(res.body.data[15].attributes).to.include({
          dispensedDate: shippedDate,
        });
      });
    listPage.verifyShippedOnInformationOnRxCardOnMedicationsListPage(
      shippedDate,
    );
  });
});
