import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import mockPrescriptionDetails from './fixtures/prescription-details.json';
import prescriptions from './fixtures/listOfPrescriptions.json';
import { Data } from './utils/constants';

describe('Medications Details Page Active Rx Progress Tracker', () => {
  it('visits Medications Details Page Active Status Progress Tracker', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 1;
    site.login();
    listPage.visitMedicationsListPageURL(prescriptions);
    detailsPage.clickMedicationDetailsLink(mockPrescriptionDetails, cardNumber);
    detailsPage.verifyActiveRxStepOneProgressTrackerOnDetailsPage(
      Data.STEP_ONE_SUBMITTED,
      Data.STEP_ONE_NOTE_ABOVE,
      Data.STEP_ONE_NO_DATE,
    );
    detailsPage.verifyActiveRxStepTwoProgressTrackerOnDetailsPage(
      Data.STEP_TWO_ACTIVE,
      Data.STEP_TWO_PROCESS_ABOVE_TEXT,
      Data.STEP_ONE_NO_DATE,
    );
    detailsPage.verifyActiveRxStepThreeProgressTrackerOnDetailsPage(
      Data.STEP_THREE_NOT_STARTED,
      Data.STEP_THREE_SUBMITTED,
      Data.STEP_THREE_NO_TRACKING,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
