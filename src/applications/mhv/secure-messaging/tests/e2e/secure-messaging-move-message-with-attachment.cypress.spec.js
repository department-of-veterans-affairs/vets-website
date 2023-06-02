import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockMessageWithAttachment from './fixtures/message-response-withattachments.json';
import mockThreadWithAttachment from './fixtures/thread-attachment-response.json';
import mockMessages from './fixtures/messages-response.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';

describe('Secure Messaging - Move Message with Attachment', () => {
  it('can move with attachment', () => {
    SecureMessagingSite.login();
    mockMessageWithAttachment.data.id = '7192838';
    mockMessageWithAttachment.data.attributes.messageId = '7192838';
    mockMessageWithAttachment.data.attributes.attachment = true;
    mockMessageWithAttachment.data.attributes.body = 'attachment';
    PatientInboxPage.loadInboxMessages(mockMessages, mockMessageWithAttachment);
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages?per_page=-1&useCache=false',
      mockMessages,
    ).as('messagesFolder');
    cy.intercept(
      'PATCH',
      `/my_health/v1/messaging/threads/${
        mockThreadWithAttachment.data.at(0).attributes.threadId
      }/move?folder_id=-3`,
      mockMessageWithAttachment,
    ).as('moveMessageWithAttachment');

    cy.get('[data-testId="inbox-sidebar"] > a').click();
    PatientMessageDetailsPage.loadMessageDetails(
      mockMessageWithAttachment,
      mockThreadWithAttachment,
    );
    cy.get('[data-testId="move-button-text"]').click({ force: true });
    cy.get('[data-testId="move-to-modal"]')
      .find('[class = "form-radio-buttons hydrated"]', {
        includeShadowDom: true,
      })
      .find('[id = "radiobutton-Deleted"]', { includeShadowDom: true })
      .click();
    cy.get('[data-testId="move-to-modal"]')
      .shadow()
      .find('button')
      .contains('Confirm')
      .click();
    cy.wait('@moveMessageWithAttachment');
    cy.injectAxe();
    cy.axeCheck();
    PatientInboxPage.verifyMoveMessagewithAttachmentSuccessMessage();
    cy.get('@moveMessageWithAttachment')
      .its('response')
      .then(response => {
        cy.log(JSON.stringify(response));
        expect(response.body.data.id).to.include('7192838');
        expect(response.statusCode).to.eq(200);
      });
  });
});
