import MedicationsSite from './med_site/MedicationsSite';
import MedicationsLandingPage from './pages/MedicationsLandingPage';
import MedicationsListPage from './pages/MedicationsListPage';
import { Data } from './utils/constants';

describe('Medications List Page Information based on Medication Status', () => {
  it('verify information on list view for active refill in process', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    const landingPage = new MedicationsLandingPage();
    site.login();
    landingPage.visitLandingPageURL();
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.clickGotoMedicationsLink();
    listPage.verifyInformationBasedOnStatusActiveRefillInProcess(
      Data.ACTIVE_REFILL_IN_PROCESS,
    );
  });
});
