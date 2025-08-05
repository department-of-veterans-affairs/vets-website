import MedicationsSite from './med_site/MedicationsSite';
import pendingPrescriptions from './fixtures/pending-prescriptions-med-list.json';
import { Data } from './utils/constants';
import pendingRxDetails from './fixtures/pending-prescriptions-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import MedicationsListPage from './pages/MedicationsListPage';

describe('Medications Details Page Pending Renewal Rx Alert', () => {
  it('visits Medications Details Page Pending Renewal Prescriptions Alert within Seven days', () => {
    const site = new MedicationsSite();
    const detailsPage = new MedicationsDetailsPage();
    const listPage = new MedicationsListPage();
    const updatedOrderDate = listPage.updatedOrderDates(pendingPrescriptions);
    site.login();
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
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
