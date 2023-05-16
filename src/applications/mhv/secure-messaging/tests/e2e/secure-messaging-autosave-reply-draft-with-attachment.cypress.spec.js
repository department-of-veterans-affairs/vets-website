import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import mockThreadResponse from './fixtures/single-draft-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockMessages from './fixtures/messages-response.json';

describe('autosave Reply draft with attachment', () => {
  it('Autosave Reply Draft', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    const inboxPage = new PatientInboxPage();
    const draftsPage = new PatientMessageDraftsPage();
    const messageDetailsPage = new PatientMessageDetailsPage();

    const patientInterstitialPage = new PatientInterstitialPage();
    site.login();
    inboxPage.loadInboxMessages();
    const messageDetails = landingPage.getNewMessageDetails();
    landingPage.loadInboxMessages(mockMessages, messageDetails);
    messageDetailsPage.loadMessageDetails(messageDetails);
    messageDetailsPage.loadReplyPageDetails(messageDetails);
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    cy.reload();
    draftsPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    cy.reload();
    patientInterstitialPage.getContinueButton().click();
    composePage
      .getMessageBodyField()
      .type('Testing Autosave Drafts with Attachments');
    cy.realPress(['Enter']);
    composePage.attachMessageFromFile('sample_docx.docx');

    mockDraftResponse.data.attributes.body =
      'ststASertTesting Autosave Drafts with Attachments\nTesting Autosave Drafts with Attachments\n';
    cy.intercept(
      'PUT',
      `/my_health/v1/messaging/message_drafts/${
        mockDraftResponse.data.attributes.messageId
      }`,
      mockDraftResponse,
    ).as('saveDraftwithAttachment');
    cy.wait('@saveDraftwithAttachment', { timeout: 8500 });
    cy.get('@saveDraftwithAttachment')
      .its('request.body')
      .should('deep.equal', {
        recipientId: mockDraftResponse.data.attributes.recipientId,
        category: mockDraftResponse.data.attributes.category,
        body:
          'ststASertTesting Autosave Drafts with Attachments\nTesting Autosave Drafts with Attachments\n',
        subject: mockDraftResponse.data.attributes.subject,
      });
    cy.contains('Your message was saved');
    cy.injectAxe();
    cy.axeCheck();
  });
});
