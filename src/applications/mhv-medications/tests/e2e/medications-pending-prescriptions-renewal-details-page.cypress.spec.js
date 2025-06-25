import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import pendingPrescriptions from './fixtures/pending-prescriptions-med-list.json';
import { Data } from './utils/constants';
import pendingRxDetails from './fixtures/pending-prescriptions-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';

describe('Medications Details Page Pending Renewal Rx Alert', () => {
  it('visits Medications Details Page Pending Renewal Prescriptions Alert Over Seven days', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    site.login();
    listPage.visitMedicationsListPageURL(pendingPrescriptions);
    detailsPage.clickMedicationDetailsLink(pendingRxDetails, 4);
    detailsPage.verifyPendingRxWarningTextOnDetailsPage(
      Data.PENDING_ALERT_TEXT,
    );
    detailsPage.verifyHeaderTextOnDetailsPage('About this prescription');
    detailsPage.verifyPendingRenewalStatusDescriptionOnDetailsPage(
      Data.PENDING_RENEW_TEXT,
    );
    detailsPage.verifyRxNumberNotVisibleOnPendingMedicationsDetailsPage(
      pendingRxDetails.data.attributes.prescriptionNumber,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
