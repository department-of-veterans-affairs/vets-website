import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxTrackingDetails from './fixtures/prescription-tracking-details.json';
import noTrackerFlag from './fixtures/togggle-no-progress-tracker.json';
import user from './fixtures/user.json';
import prescriptions from './fixtures/listOfPrescriptions.json';

describe('Medications Details Page Shipping Information for Rx', () => {
  it('visits Medications Details Page Shipped On Information', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();

    const cardNumber = 16;
    const shippedDate = 'September 24, 2023';

    site.loginWithFeatureToggles(user, noTrackerFlag);
    listPage.visitMedicationsListPageURL(prescriptions);
    detailsPage.clickMedicationDetailsLink(rxTrackingDetails, cardNumber);
    cy.get('@Medications')
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
