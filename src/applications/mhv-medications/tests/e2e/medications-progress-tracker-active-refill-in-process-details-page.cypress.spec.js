import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import mockPrescriptionDetails from './fixtures/active-prescriptions-with-refills.json';
import prescriptions from './fixtures/listOfPrescriptions.json';
import { Data } from './utils/constants';

describe('Medications Details Page Active Rx in Process Tracker', () => {
  it('visits Medications Details Page Active Rx In Process Tracker', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 2;
    site.login();
    listPage.visitMedicationsListPageURL(prescriptions);
    detailsPage.clickMedicationDetailsLink(mockPrescriptionDetails, cardNumber);
    detailsPage.verifyActiveRxStepOneProgressTrackerOnDetailsPage(
      Data.STEP_ONE_SUBMITTED,
      Data.STEP_ONE_NOTE_ABOVE,
    );
    detailsPage.verifyActiveRefillInProcessStepTwoOnDetailsPage(
      Data.STEP_TWO_ACTIVE,
      Data.STEP_TWO_PROCESS_ABOVE_TEXT,
    );
    detailsPage.verifyActiveRefillInProcessStepThreeOnDetailsPage(
      Data.STEP_THREE_SHIPPED,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
