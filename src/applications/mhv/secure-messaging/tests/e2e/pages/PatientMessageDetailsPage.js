import mockMessage from '../fixtures/message-response.json';
import mockThread from '../fixtures/thread-response.json';

class PatientMessageDetailsPage {
  loadReplyPage = (
    messageId,
    messageCategory,
    messageTitle,
    messageBody,
    messageDate,
    messageRecipientId,
  ) => {
    mockMessage.data.attributes.sentDate = messageDate;
    mockMessage.data.attributes.subject = messageTitle;
    mockMessage.data.attributes.body = messageBody;
    mockMessage.data.attributes.category = messageCategory;
    mockMessage.data.attributes.messageId = messageId;
    mockMessage.data.attributes.recipientId = messageRecipientId;
    mockThread.data.at(0).attributes.sentDate = messageDate;
    mockThread.data.at(0).attributes.messageId = messageId;
    mockThread.data.at(0).attributes.subject = messageTitle;
    mockThread.data.at(0).attributes.body = messageBody;
    mockThread.data.at(0).attributes.category = messageCategory;
    mockThread.data.at(0).attributes.messageRecipient = messageRecipientId;
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
    cy.wait('@message').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
    cy.wait('@full-thread');
    cy.intercept(
      'POST',
      `/my_health/v1/messaging/message_drafts/${messageId}/replydraft`,
    ).as('replyDraftSave');
  };

  verifyTrashButtonModal = () => {
    cy.get('[data-testid=trash-button-text]').click();

    cy.get('[data-testid=delete-message-confirm-note] p', { timeout: 8000 })
      .contains('Messages in the trash folder')
      .should('be.visible');
    cy.get('[data-testid=delete-message-modal]')
      .shadow()
      .find('h1')
      .contains('Are you sure you want to move this message to the trash?')
      .should('be.visible');
    cy.get('[data-testid=delete-message-modal]')
      .shadow()
      .find('button')
      .contains('Confirm')
      .should('be.visible');
    cy.get('[data-testid=delete-message-modal]')
      .shadow()
      .find('button')
      .contains('Cancel')
      .should('be.visible')
      .click();
  };

  verifyMoveToButtonModal = () => {
    cy.get('[data-testid=move-button-text]').click();
    cy.get('[data-testid=move-to-modal]', { timeout: 8000 })
      .find('p')
      .contains(
        'This conversation will be moved. Any replies to this message will appear in your inbox',
      )
      .should('be.visible');
    cy.get('[data-testid=radiobutton-Deleted]').should('be.visible');
    cy.get('[data-testid=radiobutton-TEST2]').should('be.visible');
    cy.get('[data-testid=radiobutton-TESTAGAIN]').should('be.visible');
    cy.get('[data-testid=folder-list-radio-button]').should('be.visible');
    cy.get('[data-testid=move-to-modal]')
      .shadow()
      .find('button')
      .contains('Confirm')
      .should('be.visible');
    cy.get('[data-testid=move-to-modal]')
      .shadow()
      .find('button')
      .contains('Cancel')
      .should('be.visible')
      .click();
  };

  verifyReplyButtonAction = () => {
    cy.get('[data-testid=reply-button-text]').click();
    cy.get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="message-body"]')
      .should('be.visible');
  };
}
export default PatientMessageDetailsPage;
