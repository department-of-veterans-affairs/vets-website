import MedicationsSite from './med_site/MedicationsSite';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';
import rxTrackingDetails from './fixtures/prescription-tracking-details.json';
import prescriptions from './fixtures/listOfPrescriptions.json';
import noTrackerFlag from './fixtures/togggle-no-progress-tracker.json';
import user from './fixtures/user.json';

describe('Medications Details Page Tracking Rx', () => {
  it('visits Medications Details Page PRescription Tracking Information', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 16;
    site.loginWithFeatureToggles(user, noTrackerFlag);
    listPage.visitMedicationsListPageURL(prescriptions);

    detailsPage.clickMedicationDetailsLink(rxTrackingDetails, cardNumber);
    detailsPage.verifyPrescriptionTrackingInformation();
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
