import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import pendingPrescriptions from './fixtures/pending-prescriptions-med-list.json';
import { Data } from './utils/constants';
import pendingRxDetails from './fixtures/pending-prescriptions-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Details Page Pending New Rx Alert', () => {
  it('visits Medications Details Page Pending New Prescriptions Alert within Seven days', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    const detailsPage = new MedicationsDetailsPage();
    const listPage = new MedicationsListPage();
    const updatedOrderDate = listPage.updatedOrderDates(pendingPrescriptions);
    site.login();

    landingPage.visitLandingPageURL();
    landingPage.visitMedicationsListPage(updatedOrderDate);
    detailsPage.clickMedicationDetailsLink(pendingRxDetails, 1);
    detailsPage.verifyPendingTextAlertForLessThanSevenDays(
      Data.PENDING_ALERT_WITHIN_SEVEN_DAYS,
    );
    detailsPage.verifyHeaderTextOnDetailsPage('About this prescription');
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
