import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';

describe('Check confirmation message after save draft', () => {
  const site = new SecureMessagingSite();
  const inboxPage = new PatientInboxPage();
  const draftPage = new PatientMessageDraftsPage();
  it('Check confirmation message after save draft', () => {
    site.login();
    inboxPage.loadInboxMessages();
    inboxPage.loadComposeMessagePage();
    draftPage.selectRecipientName(`6910405`);
    draftPage.selectCategory('General');
    draftPage.addMessageSubject('testSubject');
    draftPage.addMessageBody('testMessage');
    // cy.axeCheck();
    cy.injectAxe();
    draftPage.saveDraftByKeyboard();
    draftPage.verifyFocusOnConfirmationMessage();
  });
});
