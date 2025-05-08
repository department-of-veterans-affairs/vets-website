import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import mockPrescriptionDetails from './fixtures/active-prescriptions-with-refills.json';
import prescriptions from './fixtures/listOfPrescriptions.json';
import rxFacilityName from './fixtures/prescription-facility-name-details-page.json';
import { Data } from './utils/constants';

describe('Medications Details Page Active Rx in Process Tracker', () => {
  const site = new MedicationsSite();
  const listPage = new MedicationsListPage();
  const detailsPage = new MedicationsDetailsPage();
  beforeEach(() => {
    site.login();
  });
  it('visits Medications Step Two Dispensed Date for Rx Record', () => {
    const cardNumber = 2;
    listPage.visitMedicationsListPageURL(prescriptions);
    detailsPage.clickMedicationDetailsLink(mockPrescriptionDetails, cardNumber);

    detailsPage.verifyActiveRefillInProcessStepTwoOnDetailsPage(
      '[data-testid="progress-step-two"]',
      Data.STEP_TWO_ACTIVE,
      Data.STEP_TWO_PROCESS_ABOVE_TEXT,
      Data.STEP_TWO_DATE,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
  it('visits Medications Step Two Dispensed Date for RxRF Records', () => {
    const cardNumber = 20;
    listPage.visitMedicationsListPageURL(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    detailsPage.clickMedicationDetailsLink(rxFacilityName, cardNumber);
    detailsPage.verifyRxRfDispensedDateOnStepTwoProgressTracker(
      rxFacilityName.data.attributes.rxRfRecords[0].dispensedDate,
    );
  });
});
