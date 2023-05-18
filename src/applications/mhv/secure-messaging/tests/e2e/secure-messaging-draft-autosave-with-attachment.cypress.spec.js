import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import mockThreadResponse from './fixtures/single-draft-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';

describe('Secure Messaging Draft AutoSave with Attachments', () => {
  it('Axe Check Draft AutoSave with Attachments', () => {
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    const inboxPage = new PatientInboxPage();
    const draftsPage = new PatientMessageDraftsPage();
    const patientInterstitialPage = new PatientInterstitialPage();
    site.login();
    inboxPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    cy.reload();
    draftsPage.loadMessageDetails(mockDraftResponse, mockThreadResponse);
    cy.reload();
    patientInterstitialPage.getContinueButton().click({ force: true });
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
        body:
          'ststASertTesting Autosave Drafts with Attachments\nTesting Autosave Drafts with Attachments\nTesting Autosave Drafts with Attachments\n',
        category: mockDraftResponse.data.attributes.category,
        recipientId: mockDraftResponse.data.attributes.recipientId,
        subject: mockDraftResponse.data.attributes.subject,
      });

    cy.contains('Your message was saved');
    cy.injectAxe();
    cy.axeCheck();
  });
});
