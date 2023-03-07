import moment from 'moment-timezone';
import mockMessage from '../fixtures/message-response.json';
import defaultMockThread from '../fixtures/thread-response.json';

class PatientMessageDetailsPage {
  currentThread = defaultMockThread;

  loadMessageDetails = (
    mockMessageDetails,
    mockThread = defaultMockThread,
    threadIndex = 1,
  ) => {
    cy.log(`mock Message Details--------${JSON.stringify(mockMessageDetails)}`);
    cy.log(
      `mock Message Details--------${JSON.stringify(
        mockMessageDetails.data.attributes.messageId,
      )}`,
    );
    this.currentThread = mockThread;
    cy.log('loading message details.');
    this.currentThread.data.at(threadIndex).attributes.sentDate =
      mockMessageDetails.data.attributes.sentDate;
    this.currentThread.data.at(threadIndex).id =
      mockMessageDetails.data.attributes.messageId;
    this.currentThread.data.at(threadIndex).attributes.messageId =
      mockMessageDetails.data.attributes.messageId;
    this.currentThread.data.at(threadIndex).attributes.subject =
      mockMessageDetails.data.attributes.subject;
    this.currentThread.data.at(threadIndex).attributes.body =
      mockMessageDetails.data.attributes.body;
    this.currentThread.data.at(threadIndex).attributes.category =
      mockMessageDetails.data.attributes.category;
    this.currentThread.data.at(threadIndex).attributes.recipientId =
      mockMessageDetails.data.attributes.recipientId;
    this.currentThread.data.at(threadIndex).attributes.senderName =
      mockMessageDetails.data.attributes.senderName;
    this.currentThread.data.at(threadIndex).attributes.recipientName =
      mockMessageDetails.data.attributes.recipientName;
    cy.log(JSON.stringify(this.currentThread.data.at(threadIndex)));
    cy.log(
      `message thread  = ${JSON.stringify(
        mockMessageDetails.data.attributes.messageId,
      )}`,
    );
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        this.currentThread.data.at(0).attributes.messageId
      }`,
      mockMessageDetails,
    ).as('message1');
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockMessageDetails.data.attributes.messageId
      }/thread`,
      this.currentThread,
    ).as('full-thread');
    cy.contains(mockMessageDetails.data.attributes.subject).click();
    cy.wait('@message1').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
    cy.wait('@full-thread');
  };

  getCurrentThread() {
    return this.currentThread;
  }

  loadReplyPageDetails = (
    mockMessageDetails,
    mockThread = defaultMockThread,
    index = 0,
  ) => {
    cy.log(`mock Message Details--------${JSON.stringify(mockMessageDetails)}`);
    cy.log(
      `mock Message Details--------${JSON.stringify(
        mockMessageDetails.data.attributes.messageId,
      )}`,
    );
    this.currentThread = mockThread;
    cy.log('loading message details.');
    this.currentThread.data.at(index).attributes.sentDate =
      mockMessageDetails.data.attributes.sentDate;
    this.currentThread.data.at(index).id =
      mockMessageDetails.data.attributes.messageId;
    this.currentThread.data.at(index).attributes.messageId =
      mockMessageDetails.data.attributes.messageId;
    this.currentThread.data.at(index).attributes.subject =
      mockMessageDetails.data.attributes.subject;
    this.currentThread.data.at(index).attributes.body =
      mockMessageDetails.data.attributes.body;
    this.currentThread.data.at(index).attributes.category =
      mockMessageDetails.data.attributes.category;
    this.currentThread.data.at(index).attributes.recipientId =
      mockMessageDetails.data.attributes.recipientId;
    this.currentThread.data.at(index).attributes.triageGroupName =
      mockMessageDetails.data.attributes.triageGroupName;
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

  expandThreadMessageDetails = (mockThread, index = 1) => {
    const threadMessageDetails = mockMessage;
    cy.log('loading message details.');
    threadMessageDetails.data.attributes.sentDate = mockThread.data.at(
      index,
    ).attributes.sentDate;
    threadMessageDetails.data.id = mockThread.data.at(index).id;
    threadMessageDetails.data.attributes.messageId = mockThread.data.at(
      index,
    ).attributes.messageId;
    threadMessageDetails.data.attributes.subject = mockThread.data.at(
      index,
    ).attributes.subject;
    threadMessageDetails.data.attributes.body = mockThread.data.at(
      index,
    ).attributes.body;
    threadMessageDetails.data.attributes.category = mockThread.data.at(
      index,
    ).attributes.category;
    threadMessageDetails.data.attributes.recipientId = mockThread.data.at(
      index,
    ).attributes.recipientId;
    cy.log(
      `thread message detail id = ${
        threadMessageDetails.data.attributes.messageId
      }`,
    );
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        threadMessageDetails.data.attributes.messageId
      }`,
      threadMessageDetails,
    ).as('messageDetails');
    cy.get('[aria-label="Expand message"]')
      .eq(index - 1)
      .click();
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

  verifyExpandedMessageFromDisplay = messageDetails => {
    cy.get('[data-testid="from"]')
      .eq(0)
      .should(
        'have.text',
        `From: ${messageDetails.data.attributes.senderName} (${
          messageDetails.data.attributes.triageGroupName
        })`,
      );
  };

  verifyExpandedMessageToDisplay = messageDetails => {
    cy.get('[data-testid="to"]').should(
      'have.text',
      messageDetails.data.attributes.recipientName,
    );
  };

  verifyExpandedMessageIDDisplay = messageDetails => {
    cy.get('[data-testid="from"]')
      .eq(0)
      .should(
        'have.text',
        `From: ${messageDetails.data.attributes.senderName} (${
          messageDetails.data.attributes.triageGroupName
        })`,
      );
  };

  verifyExpandedMessageDateDisplay = messageDetails => {
    const timeZone = moment.tz.guess();
    cy.get('[data-testid="message-date"]')
      .eq(0)
      .should(
        'have.text',
        moment
          .tz(messageDetails.data.attributes.sentDate, timeZone)
          .format('MMMM D, YYYY [at] h:mm a z'),
      );
  };
}
export default PatientMessageDetailsPage;
