import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientComposePage from './pages/PatientComposePage';
import FolderLoadPage from './pages/FolderLoadPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Verify Compose Data When Cancel Navigate Away', () => {
  // const composePage = new PatientComposePage();

  it('Verify Data When Cancel Navigate Away', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    PatientComposePage.enterDataToMessageSubject();
    PatientComposePage.enterDataToMessageBody();

    FolderLoadPage.backToInbox();

    PatientComposePage.verifyAlertModal();
    PatientComposePage.clickOnContinueEditingButton();

    PatientComposePage.verifyComposePageValuesRetainedAfterContinueEditing();

    PatientComposePage.verifyRecipientNameText();
    PatientComposePage.verifySubjectFieldText('testSubject');
  });
});
