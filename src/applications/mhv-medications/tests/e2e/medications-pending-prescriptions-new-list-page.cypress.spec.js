import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import pendingPrescriptions from './fixtures/pending-prescriptions-med-list.json';
import { Data } from './utils/constants';
import MedicationsListPage from './pages/MedicationsListPage';
import pendingRxDetails from './fixtures/pending-prescriptions-details.json';

describe('Medications List Page Pending New Rx', () => {
  it('visits Medications List Page Pending New Prescriptions', () => {
    const site = new MedicationsSite();
    const landingPage = new MedicationsLandingPage();
    const listPage = new MedicationsListPage();
    site.login();
    landingPage.visitLandingPageURL();
    landingPage.visitMedicationsListPage(pendingPrescriptions);
    listPage.verifyPendingNewRxInfoTextOnMedicationCardOnListPage(
      Data.PENDING_RX_CARD_INFO,
    );
    listPage.verifyPrecriptionNumberForPendingRxOnMedicationCard(
      pendingRxDetails.data.attributes.prescriptionNumber,
      1,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
