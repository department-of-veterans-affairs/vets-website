import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import { Data } from './utils/constants';

describe('Medications List Page Need Help Section', () => {
  beforeEach(() => {
    const site = new MedicationsSite();
    site.login();
  });
  it('visits Medications List Need Help Section', () => {
    const listPage = new MedicationsListPage();
    listPage.visitMedicationsListPageURL(prescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyNeedHelpSectionOnListPage(Data.HELP_TEXT);
    listPage.verifyGoToUseMedicationLinkOnListPage();
    listPage.verifyStartANewMessageLinkOnListPage();
  });
  it('visits Medications List Title Notes', () => {
    const listPage = new MedicationsListPage();
    listPage.visitMedicationsListPageURL(prescriptions);
    listPage.verifyTitleNotesOnListPage(Data.LIST_PAGE_TITLE_NOTES);
    cy.injectAxe();
    cy.axeCheck('main');
  });
});
