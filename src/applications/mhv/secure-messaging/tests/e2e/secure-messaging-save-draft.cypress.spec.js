import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import mockDraftFolderMetaResponse from './fixtures/folder-drafts-metadata.json';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';

describe('Secure Messaging Save Draft', () => {
  it('Axe Check Save Draft', () => {
    const mockThreadResponse = { data: [] };
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2',
      mockDraftFolderMetaResponse,
    ).as('draftsFolderMetaResponse');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2/messages**',
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
      'GET',
      '/my_health/v1/messaging/messages/7208913/thread',
      mockThreadResponse,
    ).as('draftThreadResponse');
    cy.contains('test').click();
    cy.wait('@draftThreadResponse');
    cy.injectAxe();
    cy.axeCheck();
    composePage.getMessageSubjectField().type('message Test');
    composePage.getMessageBodyField().type('Test message body');
    composePage.saveDraft(
      6978854,
      'OTHER',
      'testmessage Test',
      'ststASertTest message body',
    );
    composePage.sendDraft(
      6978854,
      'OTHER',
      'testmessage Test',
      'ststASertTest message body',
    );
  });
});
