import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import mockDraftFolderMetaResponse from './fixtures/folder-drafts-metadata.json';
import mockDraftMessages from './fixtures/drafts-response.json';
import mockDraftResponse from './fixtures/message-draft-response.json';

describe('Secure Messaging Draft Save with Attachments', () => {
  it('Axe Check Draft Save with Attachments', () => {
    const landingPage = new PatientInboxPage();
    const composePage = new PatientComposePage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadPage(false);
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
      'PUT',
      '/my_health/v1/messaging/message_drafts/7208913',
      mockDraftResponse,
    ).as('saveDraftwithAttachment');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/7208913/thread',
      mockDraftResponse,
    ).as('draftwithAttachment');
    cy.contains('test').click();

    // Assertion of network response
    cy.get('@draftsFolderMetaResponse')
      .its('response')
      .then(res => {
        expect(res.headers).to.include({
          'content-type': 'application/json',
        });
      });

    cy.get('[data-testid="message-subject-field"]')
      .shadow()
      .find('[name="message-subject"]')
      .type(' Draft Save with Attachments');
    cy.get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="message-body"]')
      .type('Testing Save Drafts with Attachments');
    composePage.attachMessageFromFile('sample_docx.docx');

    composePage.saveDraft();

    // Assertion of network request
    cy.get('@draft_message')
      .its('request.body')
      .should('deep.equal', {
        recipientId: 6978854,
        category: 'OTHER',
        subject: 'test Draft Save with Attachments',
        body: 'ststASertTesting Save Drafts with Attachments',
      });
    // Assertion of network response including attachment:false

    cy.get('@draft_message')
      .its('response')
      .then(res => {
        expect(res.body.data.attributes).to.include({
          attachment: false,
        });
      });

    cy.get('[visible=""] > p').should(
      'contain',
      "If you save this message as a draft, you'll need to attach your files again when you're ready to send the message.",
    );

    cy.injectAxe();
    cy.axeCheck();
  });
});
