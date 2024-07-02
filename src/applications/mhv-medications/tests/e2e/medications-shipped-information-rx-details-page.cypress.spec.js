import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxTrackingDetails from './fixtures/prescription-tracking-details.json';
import MedicationsLandingPage from './pages/MedicationsLandingPage';

describe('Medications Details Page Shipping Information for Rx', () => {
  it('visits Medications Details Page Shipped On Information', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const landingPage = new MedicationsLandingPage();
    const cardNumber = 16;
    const shippedDate = 'September 24, 2023';
    site.login();
    landingPage.visitLandingPageURL();
    listPage.clickGotoMedicationsLink();
    detailsPage.clickMedicationDetailsLink(rxTrackingDetails, cardNumber);
    cy.get('@medicationsList')
      .its('response')
      .then(res => {
        expect(res.body.data[15].attributes).to.include({
          dispensedDate: shippedDate,
        });
      });
    detailsPage.verifyShippedOnInformationRxDetailsPage(shippedDate);
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
