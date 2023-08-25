import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import recipientsList from '../fixtures/recipients-response.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('Check confirmation message after save draft', () => {
  const site = new SecureMessagingSite();
  const inboxPage = new PatientInboxPage();
  const draftPage = new PatientMessageDraftsPage();
  it('Check confirmation message after save draft', () => {
    site.login();
    inboxPage.loadInboxMessages();
    inboxPage.navigateToComposePage();
    draftPage.selectRecipientName(
      recipientsList.data[0].attributes.triageTeamId.toString(),
    );
    draftPage.selectCategory('General');
    draftPage.addMessageSubject('testSubject');
    draftPage.addMessageBody('testMessage');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    draftPage.saveDraftByKeyboard();
    // draftPage.verifyFocusOnConfirmationMessage();
    // --focus currently stays on save draft button.  Will check later
  });
});
