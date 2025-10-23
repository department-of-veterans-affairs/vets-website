import MedicationsSite from './med_site/MedicationsSite';
import pendingPrescriptions from './fixtures/pending-prescriptions-med-list.json';
import { Data } from './utils/constants';
import MedicationsListPage from './pages/MedicationsListPage';
import pendingRenewalRxDetails from './fixtures/pending-prescriptions-for-renewal.json';

describe('Medications List Page Pending Rx Renew', () => {
  it('visits Medications List Page Pending Prescriptions Renewal', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(pendingPrescriptions);
    listPage.verifyPendingRenewalInfoTextOnMedicationCardOnListPage(
      Data.PENDING_RENEW_TEXT,
    );
    listPage.verifyPrecriptionNumberForPendingRxOnMedicationCard(
      pendingRenewalRxDetails.data.attributes.prescriptionNumber,
      4,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
