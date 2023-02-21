import mockMessage from '../fixtures/message-response.json';
import mockThread from '../fixtures/thread-response.json';

class PatientMessageDetailsKeyboardPage {
  loadReplyPage = (messageId, messageTitle, messageDate) => {
    mockMessage.data.attributes.sentDate = messageDate;
    mockMessage.data.attributes.messageTitle = messageTitle;
    mockMessage.data.attributes.messageId = messageId;
    cy.get('[data-testid="reply-button-top"]').realPress('Enter');
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

  verifyPrint = () => {
    cy.get('[data-testid=print-button]').realClick();

    cy.get('[data-testid=print-modal-popup]', { timeout: 8000 })
      .shadow()
      .find('h1')
      .contains('What do you want to print?')
      .should('be.visible');
    cy.get('[data-testid="radio-print-one-message"]')
      .realClick()
      .should('be.visible');
    cy.get('[data-testid="radio-print-all-messages"]').should('be.visible');
    cy.get('[data-testid=print-modal-popup]')
      .shadow()
      .find('button')
      .contains('Print')
      .should('be.visible');
    cy.get('[data-testid=print-modal-popup]')
      .shadow()
      .find('button')
      .contains('Cancel')
      .realClick();
    cy.tabToElement('[data-testid=move-button-text]').should('exist');
  };

  verifyTrash = () => {
    cy.get('[data-testid=trash-button-text]').realClick();

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
      .realClick();
  };

  verifyMoveTo = () => {
    cy.get('[data-testid=move-button-text]').realClick();
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
      .realPress('Enter');
  };

  verifyReply = () => {
    cy.get('[data-testid=reply-button-text]').realClick();
  };
}
export default PatientMessageDetailsKeyboardPage;
