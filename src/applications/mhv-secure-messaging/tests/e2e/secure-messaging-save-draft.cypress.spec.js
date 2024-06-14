import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Save Draft', () => {
  it('Axe Check Save Draft', () => {
    const draftsPage = new PatientMessageDraftsPage();
    const site = new SecureMessagingSite();
    site.login();
    PatientInboxPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse);
    PatientInterstitialPage.getContinueButton().should('not.exist');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    // composePage.getMessageSubjectField().type('message Test');
    PatientComposePage.getMessageBodyField().type('Test message body', {
      force: true,
    });
    cy.realPress(['Enter']);

    const mockDraftResponseUpdated = {
      ...mockDraftResponse,
      data: {
        ...mockDraftResponse.data,
        attributes: {
          ...mockDraftResponse.data.attributes,
          body: 'ststASertTest message body',
        },
      },
    };
    PatientComposePage.saveDraft(mockDraftResponseUpdated);
    PatientComposePage.sendDraft(mockDraftResponseUpdated);
    PatientComposePage.verifySendMessageConfirmationMessageText();
    PatientComposePage.verifySendMessageConfirmationMessageHasFocus();
  });
});
