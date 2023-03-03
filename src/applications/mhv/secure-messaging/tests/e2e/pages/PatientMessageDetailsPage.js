import mockMessage from '../fixtures/message-response.json';
import defaultMockThread from '../fixtures/thread-response.json';

class PatientMessageDetailsPage {
  currentThread = defaultMockThread;

  loadMessageDetails = (mockMessageDetails, mockThread = defaultMockThread) => {
    cy.log(`mock Message Details--------${JSON.stringify(mockMessageDetails)}`);
    cy.log(
      `mock Message Details--------${JSON.stringify(
        mockMessageDetails.data.attributes.messageId,
      )}`,
    );
    this.currentThread = mockThread;
    cy.log('loading message details.');
    this.currentThread.data.at(0).attributes.sentDate =
      mockMessageDetails.data.attributes.sentDate;
    this.currentThread.data.at(0).id =
      mockMessageDetails.data.attributes.messageId;
    this.currentThread.data.at(0).attributes.messageId =
      mockMessageDetails.data.attributes.messageId;
    this.currentThread.data.at(0).attributes.subject =
      mockMessageDetails.data.attributes.subject;
    this.currentThread.data.at(0).attributes.body =
      mockMessageDetails.data.attributes.body;
    this.currentThread.data.at(0).attributes.category =
      mockMessageDetails.data.attributes.category;
    this.currentThread.data.at(0).attributes.recipientId =
      mockMessageDetails.data.attributes.recipientId;
    cy.log(JSON.stringify(this.currentThread.data.at(0)));
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockMessageDetails.data.attributes.messageId
      }`,
      mockMessageDetails,
    ).as('message');
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockMessageDetails.data.attributes.messageId
      }/thread`,
      this.currentThread,
    ).as('full-thread');
    cy.contains(mockMessageDetails.data.attributes.subject).click();
    cy.wait('@message').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
    cy.wait('@full-thread');
  };

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
    defaultMockThread.data.at(0).attributes.sentDate = messageDate;
    defaultMockThread.data.at(0).attributes.messageId = messageId;
    defaultMockThread.data.at(0).attributes.subject = messageTitle;
    defaultMockThread.data.at(0).attributes.body = messageBody;
    defaultMockThread.data.at(0).attributes.category = messageCategory;
    defaultMockThread.data.at(
      0,
    ).attributes.messageRecipient = messageRecipientId;
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
      defaultMockThread,
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

  loadReplyPageDetails = (
    mockMessageDetails,
    mockThread = defaultMockThread,
  ) => {
    cy.log(`mock Message Details--------${JSON.stringify(mockMessageDetails)}`);
    cy.log(
      `mock Message Details--------${JSON.stringify(
        mockMessageDetails.data.attributes.messageId,
      )}`,
    );
    this.currentThread = mockThread;
    cy.log('loading message details.');
    this.currentThread.data.at(0).attributes.sentDate =
      mockMessageDetails.data.attributes.sentDate;
    this.currentThread.data.at(0).id =
      mockMessageDetails.data.attributes.messageId;
    this.currentThread.data.at(0).attributes.messageId =
      mockMessageDetails.data.attributes.messageId;
    this.currentThread.data.at(0).attributes.subject =
      mockMessageDetails.data.attributes.subject;
    this.currentThread.data.at(0).attributes.body =
      mockMessageDetails.data.attributes.body;
    this.currentThread.data.at(0).attributes.category =
      mockMessageDetails.data.attributes.category;
    this.currentThread.data.at(0).attributes.recipientId =
      mockMessageDetails.data.attributes.recipientId;
    cy.get('[data-testid="reply-button-top"]').click();
    cy.log('loading message reply details.');

    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockMessageDetails.data.attributes.messageId
      }`,
      mockMessage,
    ).as('message');
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockMessageDetails.data.attributes.messageId
      }/thread`,
      mockThread,
    ).as('full-thread');
    cy.wait('@message').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
    cy.wait('@full-thread');
    cy.intercept(
      'POST',
      `/my_health/v1/messaging/message_drafts/${
        mockMessageDetails.data.attributes.messageId
      }/replydraft`,
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
