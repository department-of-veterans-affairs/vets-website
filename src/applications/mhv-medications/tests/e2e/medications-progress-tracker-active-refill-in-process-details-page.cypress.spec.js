import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import mockPrescriptionDetails from './fixtures/active-prescriptions-with-refills.json';
import refillProcessed from './fixtures/active-refill-in-process-details.json';
import prescriptions from './fixtures/listOfPrescriptions.json';
import { Data } from './utils/constants';

describe('Medications Details Page Active Rx in Process Tracker', () => {
  const site = new MedicationsSite();
  const listPage = new MedicationsListPage();
  const detailsPage = new MedicationsDetailsPage();
  beforeEach(() => {
    site.login();
  });
  it('visits Medications Details Page Active Rx In Process Shipped', () => {
    const cardNumber = 2;
    listPage.visitMedicationsListPageURL(prescriptions);
    detailsPage.clickMedicationDetailsLink(mockPrescriptionDetails, cardNumber);
    detailsPage.verifyActiveRxStepOneProgressTrackerOnDetailsPage(
      Data.STEP_ONE_SUBMITTED,
      Data.STEP_ONE_NOTE_ABOVE,
      Data.STEP_ONE_NO_DATE,
    );
    detailsPage.verifyActiveRefillInProcessStepTwoOnDetailsPage(
      '[data-testid="progress-step-two"]',
      Data.STEP_TWO_ACTIVE,
      Data.STEP_TWO_PROCESS_ABOVE_TEXT,
      Data.STEP_TWO_DATE,
    );
    // detailsPage.verifyActiveRefillInProcessStepThreeOnDetailsPage(
    //   Data.STEP_THREE_NOTE_ABOVE,
    //   Data.STEP_THREE_SHIPPED,
    //   Data.STEP_THREE_DATE,
    // );
    cy.injectAxe();
    cy.axeCheck('main');
  });

  it('visits Medications Details Page Active Rx In Process Step Two', () => {
    const cardNumber = 14;
    const upDatedRefillDate = listPage.updatedRefillDates(prescriptions);
    listPage.visitMedicationsListPageURL(upDatedRefillDate);
    detailsPage.clickMedicationDetailsLink(refillProcessed, cardNumber);
    detailsPage.verifyStepTwoHeaderOnDetailPageForRxInProcess(
      Data.STEP_TWO_PROCESS,
      Data.STEP_TWO_PROCESS_HEADER,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
