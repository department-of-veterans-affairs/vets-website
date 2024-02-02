import mockMessage from '../fixtures/message-response.json';
import mockFolders from '../fixtures/folder-response.json';
import defaultMockThread from '../fixtures/thread-response.json';
import { dateFormat } from '../../../util/helpers';

class PatientMessageDetailsPage {
  currentThread = defaultMockThread;
  // currentDetailedMessage = mockMessage;

  loadMessageDetails = (
    mockParentMessageDetails,
    mockThread = defaultMockThread,
    previousMessageIndex = 1,
    mockPreviousMessageDetails = mockMessage,
    getFoldersStatus = 200,
  ) => {
    this.currentThread = mockThread;

    this.currentThread.data.at(0).attributes.sentDate =
      mockParentMessageDetails.data.attributes.sentDate;
    this.currentThread.data.at(0).id =
      mockParentMessageDetails.data.attributes.messageId;
    this.currentThread.data.at(0).attributes.messageId =
      mockParentMessageDetails.data.attributes.messageId;
    this.currentThread.data.at(0).attributes.subject =
      mockParentMessageDetails.data.attributes.subject;
    this.currentThread.data.at(0).attributes.body =
      mockParentMessageDetails.data.attributes.body;
    this.currentThread.data.at(0).attributes.category =
      mockParentMessageDetails.data.attributes.category;
    this.currentThread.data.at(0).attributes.recipientId =
      mockParentMessageDetails.data.attributes.recipientId;
    this.currentThread.data.at(0).attributes.senderName =
      mockParentMessageDetails.data.attributes.senderName;
    this.currentThread.data.at(0).attributes.recipientName =
      mockParentMessageDetails.data.attributes.recipientName;

    cy.log(
      `loading parent message details.${
        this.currentThread.data.at(0).attributes.messageId
      }`,
    );
    this.currentThread.data.at(previousMessageIndex).attributes.sentDate =
      mockPreviousMessageDetails.data.attributes.sentDate;
    this.currentThread.data.at(previousMessageIndex).id =
      mockPreviousMessageDetails.data.attributes.messageId;
    this.currentThread.data.at(previousMessageIndex).attributes.messageId =
      mockPreviousMessageDetails.data.attributes.messageId;
    this.currentThread.data.at(previousMessageIndex).attributes.subject =
      mockPreviousMessageDetails.data.attributes.subject;
    this.currentThread.data.at(previousMessageIndex).attributes.body =
      mockPreviousMessageDetails.data.attributes.body;
    this.currentThread.data.at(previousMessageIndex).attributes.category =
      mockPreviousMessageDetails.data.attributes.category;
    this.currentThread.data.at(previousMessageIndex).attributes.recipientId =
      mockPreviousMessageDetails.data.attributes.recipientId;
    this.currentThread.data.at(previousMessageIndex).attributes.senderName =
      mockPreviousMessageDetails.data.attributes.senderName;
    this.currentThread.data.at(previousMessageIndex).attributes.recipientName =
      mockPreviousMessageDetails.data.attributes.recipientName;
    this.currentThread.data.at(
      previousMessageIndex,
    ).attributes.triageGroupName =
      mockPreviousMessageDetails.data.attributes.triageGroupName;
    cy.log(
      `message thread  = ${JSON.stringify(
        mockParentMessageDetails.data.attributes.messageId,
      )}`,
    );
    if (getFoldersStatus === 200) {
      cy.intercept('GET', '/my_health/v1/messaging/folders*', mockFolders).as(
        'folders',
      );
    } else {
      cy.intercept('GET', '/my_health/v1/messaging/folders*', {
        statusCode: 400,
        body: {
          alertType: 'error',
          header: 'err.title',
          content: 'err.detail',
          response: {
            header: 'err.title',
            content: 'err.detail',
          },
        },
      }).as('folders');
    }

    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        this.currentThread.data.at(0).attributes.messageId
      }`,
      mockParentMessageDetails,
    ).as(`message1`);

    cy.log(` thread size = ${this.currentThread.data.length}`);
    //  mockParentMessageDetails.data.attributes.messageId= this.currentThread.data.at(this.currentThread.data.length-1).attributes.messageId;
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        this.currentThread.data.at(this.currentThread.data.length - 1)
          .attributes.messageId
      }`,
      mockParentMessageDetails,
    ).as('last_message');

    /*
    for (let i = 0; i < this.currentThread.length; i++) {
      cy.log("intercepting thread "+ i);
      cy.intercept(
        'GET',
        `/my_health/v1/messaging/messages/${
          this.currentThread.data.at(i).attributes.messageId
        }`,
        mockParentMessageDetails,
      ).as(`message${i}`);
    }
*/
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockParentMessageDetails.data.attributes.messageId
      }/thread?full_body=true`,
      this.currentThread,
    ).as('full-thread');

    cy.contains(`${mockParentMessageDetails.data.attributes.subject}`)
      .should('be.visible')
      .click({ force: true });

    cy.location('pathname', { timeout: 5000 }).should('include', '/thread');
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
    this.currentThread = mockThread;
    cy.log('loading reply message details.');
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
    cy.get('[data-testid="reply-button-body"]')
      .should('be.visible')
      .click({ force: true });

    // cy.get('[data-testid="reply-button-top"]').click({
    //   waitforanimations: true,
    // });
    cy.log('loading message reply details.');

    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockMessageDetails.data.attributes.messageId
      }`,
      mockMessage,
    ).as('message2');
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockMessageDetails.data.attributes.messageId
      }/thread?full_body=true`,
      mockThread,
    ).as('full-thread');
    cy.wait('@full-thread');
    cy.intercept(
      'POST',
      `/my_health/v1/messaging/message_drafts/${
        mockMessageDetails.data.attributes.messageId
      }/replydraft`,
    ).as('replyDraftSave');

    // cy.wait('@message2');
  };

  expandAllThreadMessages = () => {
    cy.intercept('GET', '/my_health/v1/messaging/messages/**', '{}').as(
      'allMessageDetails',
    );
    cy.get('[data-testid="thread-expand-all"]').should('be.visible');
    cy.get('[data-testid="thread-expand-all"]')
      .shadow()
      .contains('Expand all +')
      .click();
  };

  expandThreadMessageDetails = (mockThread, index = 1) => {
    const threadMessageDetails = mockMessage;
    cy.log('loading expanded thread message details.');
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
    threadMessageDetails.data.attributes.readReceipt = mockThread.data.at(
      index,
    ).attributes.readReceipt;
    threadMessageDetails.data.attributes.recipientId = mockThread.data.at(
      index,
    ).attributes.recipientId;
    threadMessageDetails.data.attributes.triageGroupName = mockThread.data.at(
      index,
    ).attributes.triageGroupName;
    cy.log(
      `thread message detail id expanding = ${
        threadMessageDetails.data.attributes.messageId
      }`,
    );

    cy.log(`expanded message content${JSON.stringify(threadMessageDetails)}`);
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        threadMessageDetails.data.attributes.messageId
      }`,
      threadMessageDetails,
    ).as('messageDetails');
    cy.get('.older-messages')
      .find(
        `[data-testid="expand-message-button-${
          threadMessageDetails.data.attributes.messageId
        }"]`,
      )
      .eq(index - 1)
      .click({ waitforanimations: true });
  };

  verifyMessageDetails = (messageDetails = mockMessage) => {
    cy.get('[data-testid="message-id"]').should(
      'contain',
      messageDetails.data.attributes.messageId,
    );
    cy.get('[data-testid="from"]').should(
      'contain',
      messageDetails.data.attributes.triageGroupName,
    );
    cy.get('[data-testid="from"]').should(
      'contain',
      messageDetails.data.attributes.senderName,
    );
    cy.get('[data-testid="to"]').should(
      'contain',
      messageDetails.data.attributes.recipientName,
    );
  };

  verifyTrashButtonModal = () => {
    cy.get('[data-testid=trash-button-text]')
      .should('be.visible')
      .click({ waitForAnimations: true });

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
      .find('va-button[text="Confirm"]')
      .should('be.visible');
    cy.get('[data-testid=move-to-modal]')
      .find('va-button[text="Cancel"]')
      .should('be.visible')
      .click();
  };

  loadReplyPage = mockMessageDetails => {
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockMessageDetails.data.attributes.messageId
      }`,
      mockMessageDetails,
    ).as('reply-message');
    cy.get('[data-testid=reply-button-text]').click();
  };

  verifyUnexpandedMessageAttachment = (messageIndex = 0) => {
    cy.log(
      `message has attachments = ${
        this.currentThread.data.at(messageIndex).attributes.hasAttachments
      }`,
    );
    if (
      this.currentThread.data.at(messageIndex + 1).attributes.hasAttachments
    ) {
      cy.log('message has attachment... checking for image');
      cy.get('[data-testid="message-attachment-img')
        .eq(messageIndex)
        .should('be.visible');
    }
    cy.log('message does not have attachment');
  };

  verifyUnexpandedMessageFromDisplay = (messageDetails, messageIndex = 0) => {
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        messageDetails.data.attributes.messageId
      }`,
      messageDetails,
    );
    cy.get('.older-message')
      .eq(messageIndex)
      .should(
        'contain',
        `From: ${messageDetails.data.attributes.senderName} (${
          messageDetails.data.attributes.triageGroupName
        })`,
      );
  };

  verifyExpandedMessageFromDisplay = (messageDetails, messageIndex = 0) => {
    cy.get('[data-testid="from"]')
      .eq(messageIndex)
      .should(
        'have.text',
        `From: ${messageDetails.data.attributes.senderName} (${
          messageDetails.data.attributes.triageGroupName
        })`,
      );
  };

  verifyExpandedMessageToDisplay = (messageDetails, messageIndex = 0) => {
    cy.get('[data-testid="to"]')
      .eq(messageIndex)
      .should(
        'have.text',
        `To: ${messageDetails.data.attributes.recipientName}`,
      );
  };

  verifyExpandedMessageIDDisplay = (messageDetails, messageIndex = 0) => {
    cy.get('[data-testid="message-id"]')
      .eq(messageIndex)
      .should(
        'have.text',
        `Message ID: ${messageDetails.data.attributes.messageId}`,
      );
  };

  verifyExpandedMessageDateDisplay = (messageDetails, messageIndex = 0) => {
    cy.get('[data-testid="message-date"]')
      .eq(messageIndex)
      .should(
        'have.text',
        `Date: ${dateFormat(
          messageDetails.data.attributes.sentDate,
          'MMMM D, YYYY [at] h:mm a z',
        )}`,
      );
  };

  verifyExpandedThreadAttachmentDisplay = (
    messageThread,
    messageIndex = 0,
    attachmentIndex = 0,
  ) => {
    cy.get(
      `[data-testid="expand-message-button-${
        messageThread.data[messageIndex].id
      }"]`,
    )
      .find(
        `[data-testid="attachment-name-${
          messageThread.data[messageIndex].attributes.attachments[
            attachmentIndex
          ].id
        }"]`,
      )
      .should(
        'have.text',
        `${
          messageThread.data[messageIndex].attributes.attachments[
            attachmentIndex
          ].name
        }`,
      );
  };

  verifyExpandedThreadBodyDisplay = (messageThread, messageIndex = 0) => {
    cy.get(
      `[data-testid="expand-message-button-${
        messageThread.data[messageIndex].id
      }"]`,
    )
      .find('[data-testid="message-body"]')
      .should(
        'have.text',
        `${messageThread.data[messageIndex].attributes.body}`,
      );
  };

  ReplyToMessageTO = (messageDetails, messageIndex = 0) => {
    cy.get('[data-testid="draft-reply-to"')
      .eq(messageIndex)
      .should(
        'have.text',
        `(Draft) To: ${messageDetails.data.attributes.senderName}\n(Team: ${
          messageDetails.data.attributes.triageGroupName
        })`,
      );
  };

  ReplyToMessagesenderName = (messageDetails, messageIndex = 0) => {
    cy.log('testing message from sender');
    cy.get('[data-testid="from"]')
      .eq(messageIndex)
      .should(
        'have.text',
        `From: ${messageDetails.data.attributes.senderName} (${
          messageDetails.data.attributes.triageGroupName
        })`,
      );
  };

  ReplyToMessageRecipientName = (messageDetails, messageIndex = 0) => {
    cy.log('testing message to recipient');
    cy.get('[data-testid="to"]')
      .eq(messageIndex)
      .should('contain', `To: ${messageDetails.data.attributes.recipientName}`);
  };

  ReplyToMessageDate = (messageDetails, messageIndex = 0) => {
    cy.get('[data-testid="message-date"]')
      .eq(messageIndex)
      .should(
        'have.text',
        `Date: ${dateFormat(
          messageDetails.data.attributes.sentDate,
          'MMMM D, YYYY [at] h:mm a z',
        )}`,
      );
  };

  ReplyToMessageId = messageDetails => {
    cy.get('[data-testid="message-id"]').should(
      'contain',
      `Message ID: ${messageDetails.data.attributes.messageId}`,
    );
  };

  // temporary changed to 'contain', 'REPLY'
  ReplyToMessageBody = testMessageBody => {
    cy.get('[data-testid="message-body"]').should('contain', testMessageBody);
  };

  verifyDeleteMessageConfirmationMessageHasFocus = () => {
    cy.focused().should('contain.text', 'Draft was successfully deleted.');
  };
}
export default PatientMessageDetailsPage;
