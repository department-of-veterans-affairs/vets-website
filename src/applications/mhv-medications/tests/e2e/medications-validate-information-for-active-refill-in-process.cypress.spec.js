import MedicationsSite from './med_site/MedicationsSite';
import rxList from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import { Data } from './utils/constants';

describe('Medications List Page Information based on Medication Status', () => {
  it('verify information on list view for active refill in process', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(rxList);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyInformationBasedOnStatusActiveRefillInProcess(
      Data.ACTIVE_REFILL_IN_PROCESS,
    );
  });
});
