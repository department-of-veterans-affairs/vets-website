import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientComposePage from './pages/PatientComposePage';
import mockMessageDetails from './fixtures/thread-message-details-afterNavAway-cancel.json';

describe('Secure Messaging Verify Compose Data When Cancel Navigate Away', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  const composePage = new PatientComposePage();

  it('Verify Data When Cancel Navigate Away', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/message_drafts',
      mockMessageDetails,
    ).as('ComposeMessageDetails');
    composePage.enterComposeMessageDetails('General');
    composePage.selectSideBarMenuOption('Sent');
    composePage.verifyAlertModal();
    composePage.clickOnContinueEditingButton();
    composePage.verifyComosePageValuesRetainedAfterContinueEditing();
    composePage.verifyRecipient('6832726');
    composePage.verifySubjectField('Test Subject');
  });
});
