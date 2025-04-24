import SecureMessagingSite from './sm_site/SecureMessagingSite';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import { AXE_CONTEXT } from './utils/constants';

describe('SM DELETE DRAFT WITH NO CHANGES', () => {
  it('navigate back to inbox', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    PatientMessageDraftsPage.clickDeleteButton();
    PatientMessageDraftsPage.verifyDeleteConfirmationMessage();
    GeneralFunctionsPage.verifyPageHeader(`Messages: Inbox`);
    GeneralFunctionsPage.verifyUrl(`inbox`);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
