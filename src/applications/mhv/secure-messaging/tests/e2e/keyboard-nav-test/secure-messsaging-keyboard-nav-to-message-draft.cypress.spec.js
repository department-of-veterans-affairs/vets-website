import mockDraftMessages from '../fixtures/drafts-response.json';
import mockDraftResponse from '../fixtures/message-draft-response.json';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDraftsPage from '../pages/PatientMessageDraftsPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockThreadResponse from '../fixtures/single-draft-response.json';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Delete Draft', () => {
  const site = new SecureMessagingSite();
  const inboxPage = new PatientInboxPage();
  const draftsPage = new PatientMessageDraftsPage();

  it('delete Drafts on key press', () => {
    site.login();
    inboxPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    draftsPage.clickDeleteButton();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
        'color-contrast': {
          enabled: false,
        },
      },
    });
    draftsPage.confirmDeleteDraftWithEnterKey(mockDraftResponse);
    draftsPage.verifyDeleteConfirmationMessage();
    draftsPage.verifyDraftMessageBannerTextHasFocus();
  });
});
