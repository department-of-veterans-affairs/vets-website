import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import mockPrescriptionDetails from './fixtures/prescription-facility-name-details-page.json';
import prescriptions from './fixtures/listOfPrescriptions.json';
import { Data } from './utils/constants';

describe('Medications Details Page Active Rx in Process Delay', () => {
  it('visits Medications Details Page Active Rx In Process Delay', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 14;
    const completedDate = 'Completed on March 14, 2025';
    site.login();
    listPage.visitMedicationsListPageURL(prescriptions);
    detailsPage.clickMedicationDetailsLink(mockPrescriptionDetails, cardNumber);
    detailsPage.verifyActiveRxStepOneProgressTrackerOnDetailsPage(
      Data.STEP_ONE_SUBMITTED,
      Data.STEP_ONE_NOTE_ABOVE,
      completedDate,
    );
    detailsPage.verifyActiveRefillInProcessStepTwoOnDetailsPage(
      '[data-testid="process-delay-header"]',
      Data.STEP_TWO_DELAY,
      Data.STEP_TWO_PROCESS,
      Data.STEP_TWO_DELAY_NOTE,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
