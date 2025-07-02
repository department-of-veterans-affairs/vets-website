import MedicationsSite from './med_site/MedicationsSite';
import pendingPrescriptions from './fixtures/pending-prescriptions-med-list.json';
import { Data } from './utils/constants';
import pendingRxDetails from './fixtures/pending-prescriptions-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Details Page Pending Rx No Refill History', () => {
  const site = new MedicationsSite();
  const detailsPage = new MedicationsDetailsPage();
  const listPage = new MedicationsListPage();
  const updatedOrderDate = listPage.updatedOrderDates(pendingPrescriptions);
  beforeEach(() => {
    site.login();
  });
  it('visits Medications Details Page Pending Renew Rx with No Refill History', () => {
    listPage.visitMedicationsListPageURL(updatedOrderDate);
    detailsPage.clickMedicationDetailsLink(pendingRxDetails, 4);
    detailsPage.verifyPendingTextAlertForLessThanSevenDays(
      Data.PENDING_ALERT_WITHIN_SEVEN_DAYS,
    );
    detailsPage.verifyHeaderTextOnDetailsPage('About this prescription');
    detailsPage.verifyPendingRenewalStatusDescriptionOnDetailsPage(
      Data.PENDING_RENEW_TEXT,
    );
    detailsPage.verifyRxNumberNotVisibleOnPendingMedicationsDetailsPage(
      pendingRxDetails.data.attributes.prescriptionNumber,
    );
    detailsPage.verifyRefillHistorySectionNotVisibleForPendingPrescriptions();
    detailsPage.verifyLastFilledDateOnDetailsPage(
      Data.PENDING_RX_FILL_DATE_TEXT,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
  it('visits Medications Details Page Pending New Rx with No Refill History', () => {
    listPage.visitMedicationsListPageURL(pendingPrescriptions);
    detailsPage.clickMedicationDetailsLink(pendingRxDetails, 1);
    detailsPage.verifyHeaderTextOnDetailsPage('About this prescription');
    detailsPage.verifyRefillHistorySectionNotVisibleForPendingPrescriptions();
    detailsPage.verifyLastFilledDateOnDetailsPage(
      Data.PENDING_RX_FILL_DATE_TEXT,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
