import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import pendingPrescriptions from './fixtures/pending-prescriptions-med-list.json';
import { Data } from './utils/constants';
import MedicationsListPage from './pages/MedicationsListPage';
import pendingRenewalRxDetails from './fixtures/pending-prescriptions-for-renewal.json';

describe('Medications List Page Pending Rx Renew', () => {
  it('visits Medications List Page Pending Prescriptions Renewal', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    const listPage = new MedicationsListPage();
    site.login();
    landingPage.visitLandingPageURL();
    landingPage.visitMedicationsListPage(pendingPrescriptions);
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
