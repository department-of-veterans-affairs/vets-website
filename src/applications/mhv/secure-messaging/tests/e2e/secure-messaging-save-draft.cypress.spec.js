import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';

describe('Secure Messaging Save Draft', () => {
  it('Axe Check Save Draft', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const draftsPage = new PatientMessageDraftsPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse);
    cy.injectAxe();
    cy.axeCheck();
    // composePage.getMessageSubjectField().type('message Test');
    composePage.getMessageBodyField().type('Test message body');
    mockDraftResponse.data.attributes.body =
      'ststASertTest message bodyTest message body';
    composePage.saveDraft(mockDraftResponse);
    composePage.sendDraft(
      6978854,
      'OTHER',
      'testmessage Test',
      'ststASertTest message body',
    );
  });
});
