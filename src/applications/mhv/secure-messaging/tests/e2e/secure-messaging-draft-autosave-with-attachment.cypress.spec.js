import SecureMessagingSite from './sm_site/SecureMessagingSite';

import PatientComposePage from './pages/PatientComposePage';
import mockDraftFolderMetaResponse from './fixtures/folder-drafts-metadata.json';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging Draft AutoSave with Attachments', () => {
  const mockThreadResponse = { data: [] };

  it('Axe Check Draft AutoSave with Attachments', () => {
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    const inboxPage = new PatientInboxPage();
    site.login();
    inboxPage.loadInboxMessages();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2',
      mockDraftFolderMetaResponse,
    ).as('draftsFolderMetaResponse');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2/threads**',
      mockDraftMessages,
    ).as('draftsResponse');
    cy.get('[data-testid="drafts-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.wait('@draftsFolderMetaResponse');
    cy.wait('@draftsResponse');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/7208913',
      mockDraftResponse,
    ).as('draftMessageResponse');
    cy.intercept(
      'PUT',
      '/my_health/v1/messaging/message_drafts/7208913',
      mockDraftResponse,
    ).as('saveDraftwithAttachment');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/7208913/thread',
      mockThreadResponse,
    ).as('draftThreadResponse');

    cy.contains('test').click();

    cy.get('@draftsFolderMetaResponse')
      .its('response')
      .then(res => {
        expect(res.headers).to.include({
          'content-type': 'application/json',
        });
      });

    composePage
      .getMessageSubjectField()
      .type(' Draft Autosave with Attachments');
    composePage
      .getMessageBodyField()
      .type('Testing Autosave Drafts with Attachments');
    composePage.attachMessageFromFile('sample_docx.docx');

    cy.wait('@saveDraftwithAttachment', { timeout: 55000 });

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
