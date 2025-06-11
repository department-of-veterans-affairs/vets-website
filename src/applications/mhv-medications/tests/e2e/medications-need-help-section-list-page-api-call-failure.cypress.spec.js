import MedicationsSite from './med_site/MedicationsSite';
import MedicationsListPage from './pages/MedicationsListPage';
import { Alerts, Data } from './utils/constants';

describe('Medications List Page Need Help Section API Call Failure', () => {
  it('visits Medications List Need Help Section', () => {
    const listPage = new MedicationsListPage();
    const site = new MedicationsSite();
    site.login();
    cy.visit('/my-health/medications');
    cy.injectAxe();
    cy.axeCheck('main');
    listPage.verifyNeedHelpSectionOnListPage(Data.HELP_TEXT);
    listPage.verifyGoToUseMedicationLinkOnListPage();
    listPage.verifyStartANewMessageLinkOnListPage();
    listPage.verifyErroMessageforFailedAPICallListPage(
      Alerts.NO_ACCESS_TO_MEDICATIONS_ERROR,
    );
  });
});
