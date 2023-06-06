import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientComposePage from './pages/PatientComposePage';
import mockMessageDetails from './fixtures/thread-message-details-afterNavAway-cancel.json';

describe('Secure Messaging Verify Compose Data When Cancel Navigate Away', () => {
  it('Verify Data When Cancel Navigate Away', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.loadComposeMessagePage();
    cy.injectAxe();
    cy.axeCheck();
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/message_drafts',
      mockMessageDetails,
    ).as('ComposeMessageDetails');
    PatientComposePage.enterComposeMessageDetails('General');
    PatientComposePage.selectSideBarMenuOption('Sent');
    PatientComposePage.verifyAlertModal();
    PatientComposePage.clickOnContinueEditingButton();
    PatientComposePage.verifyComosePageValuesRetainedAfterContinueEditing();
    PatientComposePage.verifyRecipient('6832726');
    PatientComposePage.verifySubjectField('Test Subject');
  });
});
