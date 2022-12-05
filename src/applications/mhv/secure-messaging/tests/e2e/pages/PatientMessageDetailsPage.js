import mockMessage from '../fixtures/message-response.json';
import mockThread from '../fixtures/thread-response.json';

class PatientMessageDetailsPage {
  loadReplyPage = (messageId, messageTitle, messageDate) => {
    mockMessage.data.attributes.sentDate = messageDate;
    mockMessage.data.attributes.messageTitle = messageTitle;
    mockMessage.data.attributes.messageId = messageId;
    cy.get('[data-testid="reply-button-top"]').click();
    cy.log('loading message details.');
    cy.log(`Sent date: ${messageDate}`);

    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${messageId}`,
      mockMessage,
    ).as('message');
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${messageId}/thread`,
      mockThread,
    ).as('full-thread');
    cy.wait('@message');
    cy.wait('@full-thread');
    cy.intercept(
      'POST',
      `/my_health/v1/messaging/message_drafts/${messageId}/replydraft`,
    ).as('replyDraftSave');
  };
}
export default PatientMessageDetailsPage;
