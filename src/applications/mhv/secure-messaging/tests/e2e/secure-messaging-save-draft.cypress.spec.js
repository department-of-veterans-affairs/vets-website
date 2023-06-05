import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';

describe('Secure Messaging Save Draft', () => {
  it('Axe Check Save Draft', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDraftsPage.loadDraftMessages(
      mockDraftMessages,
      mockDraftResponse,
    );
    PatientMessageDraftsPage.loadMessageDetails(mockDraftResponse);
    PatientInterstitialPage.getContinueButton().click();
    cy.injectAxe();
    cy.axeCheck();
    // composePage.getMessageSubjectField().type('message Test');
    PatientComposePage.getMessageBodyField().type('Test message body');
    cy.realPress(['Enter']);

    const mockDraftResponseUpdated = {
      ...mockDraftResponse,
      data: {
        ...mockDraftResponse.data,
        attributes: {
          ...mockDraftResponse.data.attributes,
          body: 'ststASertTest message body\n',
        },
      },
    };
    PatientComposePage.saveDraft(mockDraftResponseUpdated);
    PatientComposePage.sendDraft(mockDraftResponseUpdated);
  });
});
