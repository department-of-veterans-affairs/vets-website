import MedicationsSite from './med_site/MedicationsSite';
import prescriptions from './fixtures/listOfPrescriptions.json';
import MedicationsListPage from './pages/MedicationsListPage';
import { Alerts, Data } from './utils/constants';
import noPrescriptions from './fixtures/empty-prescriptions-list.json';

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
  it('visits Medications List Need Help Section for Empty Med List', () => {
    const listPage = new MedicationsListPage();
    listPage.visitMedicationsListPageURL(noPrescriptions);
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyNeedHelpSectionOnListPage(Data.HELP_TEXT);
    listPage.verifyGoToUseMedicationLinkOnListPage();
    listPage.verifyStartANewMessageLinkOnListPage();
    listPage.verifyEmptyMedicationsListAlertOnListPage(Alerts.EMPTY_MED_LIST);
  });
});
