import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import submittedRx from './fixtures/active-submitted-prescription-details.json';
import MedicationsDetailsPage from './pages/MedicationsDetailsPage';
import prescriptions from './fixtures/listOfPrescriptions.json';
import { Data } from './utils/constants';

describe('Medications Details Page Active Submitted Progress Tracker', () => {
  it('visits Medications Details Page Active Submitted Progress Tracker', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const detailsPage = new MedicationsDetailsPage();
    const cardNumber = 4;
    site.login();
    listPage.visitMedicationsListPageURL(prescriptions);

    detailsPage.clickMedicationDetailsLink(submittedRx, cardNumber);
    detailsPage.verifyProcessStepOneHeaderOnDetailsPage(
      Data.STEP_ONE_SUBMITTED,
      Data.STEP_ONE_DATE_TEXT,
    );
    detailsPage.verifyProcessStepTwoHeaderOnDetailsPage(
      Data.STEP_TWO_SUBMITTED,
      Data.STEP_TWO_NOTE,
    );
    detailsPage.verifyProcessStepThreeHeaderOnDetailsPage(
      Data.STEP_THREE_SUBMITTED,
      Data.STEP_THREE_NO_TRACKING,
    );
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
