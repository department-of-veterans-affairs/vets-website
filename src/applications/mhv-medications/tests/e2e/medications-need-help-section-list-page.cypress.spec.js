import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import { Data } from './utils/constants';

describe('Medications List Page Need Help Section', () => {
  it('visits Medications List Need Help Section', () => {
    const site = new MedicationsSite();
    const listPage = new MedicationsListPage();
    site.login();
    listPage.visitMedicationsListPageURL(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyNeedHelpSectionOnListPage(Data.HELP_TEXT);
    listPage.verifyGoToUseMedicationLinkOnListPage();
    listPage.verifyStartANewMessageLinkOnListPage();
  });
});
