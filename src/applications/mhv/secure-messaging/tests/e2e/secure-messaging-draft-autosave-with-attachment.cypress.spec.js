import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import defaultMockThread from './fixtures/thread-response.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';

describe('Secure Messaging Draft AutoSave with Attachments', () => {
  it('Axe Check Draft AutoSave with Attachments', () => {
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    const inboxPage = new PatientInboxPage();
    const draftsPage = new PatientMessageDraftsPage();
    site.login();
    inboxPage.loadInboxMessages();
    draftsPage.loadDraftMessages(mockDraftMessages, mockDraftResponse);
    draftsPage.loadMessageDetails(mockDraftResponse, defaultMockThread);

    cy.injectAxe();
    cy.axeCheck();

    composePage
      .getMessageSubjectField()
      .type(' Draft Autosave with Attachments');
    composePage
      .getMessageBodyField()
      .type('Testing Autosave Drafts with Attachments');
    composePage.attachMessageFromFile('sample_docx.docx');

    cy.intercept(
      'PUT',
      '/my_health/v1/messaging/message_drafts/7208913',
      mockDraftResponse,
    ).as('saveDraftwithAttachment');
    cy.wait('@saveDraftwithAttachment', { timeout: 5500 });

    cy.get('@saveDraftwithAttachment')
      .its('request.body')
      .should('deep.equal', {
        recipientId: 6978854,
        category: 'OTHER',
        subject: 'test Draft Autosave with Attachments',
        body: 'ststASertTesting Autosave Drafts with Attachments',
      });

    cy.contains('Your message was saved');
    cy.injectAxe();
    cy.axeCheck();
  });
});
