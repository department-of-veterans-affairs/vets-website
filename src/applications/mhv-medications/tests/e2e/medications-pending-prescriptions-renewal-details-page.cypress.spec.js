import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import pendingPrescriptions from './fixtures/pending-prescriptions-med-list.json';
import { Data } from './utils/constants';
import pendingRxDetails from './fixtures/pending-prescriptions-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Details Page Pending Renewal Rx Alert', () => {
  it('visits Medications Details Page Pending Renewal Prescriptions Alert Over Seven days', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    landingPage.visitLandingPageURL();
    landingPage.visitMedicationsListPage(pendingPrescriptions);
    detailsPage.clickMedicationDetailsLink(pendingRxDetails, 4);
    detailsPage.verifyPendingRxWarningTextOnDetailsPage(
      Data.PENDING_ALERT_TEXT,
    );
    detailsPage.verifyHeaderTextOnDetailsPage('About this prescription');
    detailsPage.verifyPendingRenewalStatusDescriptionOnDetailsPage(
      Data.PENDING_RENEW_TEXT,
    );
    detailsPage.verifyPreviousPrescriptionHeaderTextOnDetailsPage(
      'Previous prescriptions',
    );
    detailsPage.verifyPreviousPrescriptionsPaginationTextOnDetailsPage(
      Data.SINGLE_PREVIOUS_RX_INFO,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
