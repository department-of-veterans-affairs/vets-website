import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/listOfPrescriptions.json';
import MedicationsRefillPage from './pages/MedicationsRefillPage';
import noPrescriptions from './fixtures/empty-prescriptions-list.json';
import { Data } from './utils/constants';

describe('Medications Refill Page Static Progress List', () => {
  beforeEach(() => {
    const site = new MedicationsSite();
    site.login();
  });
  it('visits refill page with Rx and Progress List', () => {
    const refillPage = new MedicationsRefillPage();
    refillPage.loadRefillPage(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.verifyHowRefillProcessWorksListHeaderTextOnRefillPage(
      Data.PROGRESS_LIST_HEADER,
    );
    refillPage.verifyProcessStepOneHeaderOnRefillPage(Data.STEP_ONE_HEADER);
    refillPage.verifyProcessStepTwoHeaderOnRefillPage(Data.STEP_TWO_HEADER);
    refillPage.verifyProcessStepThreeHeaderOnRefillPage(Data.STEP_THREE_HEADER);
    refillPage.verifyProcessStepThreeNoteOnRefillPage(Data.STEP_THREE_NOTE);
  });
  it('visits refill page with No Rx and Progress List', () => {
    const refillPage = new MedicationsRefillPage();
    refillPage.loadRefillPage(noPrescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    refillPage.verifyRefillPageTitle();
    refillPage.verifyNoMedicationsAvailableMessageOnRefillPage();
    refillPage.verifyHowRefillProcessWorksListHeaderTextOnRefillPage(
      Data.PROGRESS_LIST_HEADER,
    );
    refillPage.verifyProcessStepOneHeaderOnRefillPage(Data.STEP_ONE_HEADER);
    refillPage.verifyProcessStepTwoHeaderOnRefillPage(Data.STEP_TWO_HEADER);
    refillPage.verifyProcessStepThreeHeaderOnRefillPage(Data.STEP_THREE_HEADER);
  });
});
