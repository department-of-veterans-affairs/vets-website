import mockDraftFolderMetaResponse from '../fixtures/folder-drafts-metadata.json';
import mockDraftMessages from '../fixtures/drafts-response.json';
import mockDraftResponse from '../fixtures/message-draft-response.json';
import defaultMockThread from '../fixtures/thread-response.json';

class PatientMessageDraftsPage {
  mockDraftMessages = undefined;

  mockDetailedMessage = undefined;

  currentThread = defaultMockThread;

  loadDraftMessages = (
    draftMessages = mockDraftMessages,
    detailedMessage = mockDraftResponse,
  ) => {
    this.mockDraftMessages = draftMessages;
    this.setDraftTestMessageDetails(detailedMessage);

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2',
      mockDraftFolderMetaResponse,
    ).as('draftsFolderMetaResponse');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2/threads?pageSize=100&pageNumber=1&sortField=SENT_DATE&sortOrder=DESC',
      this.draftMessages,
    ).as('draftsResponse');
    cy.get('[data-testid="drafts-sidebar"]').click();
    // cy.wait('@draftsResponse');
    // cy.wait('@draftsFolderMetaResponse');
  };

  setDraftTestMessageDetails = mockMessage => {
    if (this.mockDraftMessages.data.length > 0) {
      cy.log(`draftMessages size ${this.mockDraftMessages.data.length}`);
      this.mockDraftMessages.data.at(0).attributes.sentDate =
        mockMessage.data.attributes.sentDate;
      this.mockDraftMessages.data.at(0).attributes.messageId =
        mockMessage.data.attributes.messageId;
      this.mockDraftMessages.data.at(0).attributes.subject =
        mockMessage.data.attributes.subject;
      this.mockDraftMessages.data.at(0).attributes.body =
        mockMessage.data.attributes.body;
      this.mockDraftMessages.data.at(0).attributes.category =
        mockMessage.data.attributes.category;
      this.mockDetailedMessage = mockMessage;
    }
  };

  loadMessageDetails = (
    mockParentMessageDetails,
    mockThread = defaultMockThread,
    previousMessageIndex = 1,
    mockPreviousMessageDetails = mockDraftResponse,
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
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        this.currentThread.data.at(0).attributes.messageId
      }`,
      mockParentMessageDetails,
    ).as('message1');

    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockParentMessageDetails.data.attributes.messageId
      }/thread`,
      this.currentThread,
    ).as('full-thread');

    cy.contains(mockParentMessageDetails.data.attributes.subject).click();
    cy.wait('@message1');
  };

  loadDraftMessageDetails = () => {
    cy.log('loading draft message details');
    cy.contains('test').click();
    cy.wait('@draftThreadResponse');

    this.getMessageSubjectField().type(' Draft Save with Attachments');
    this.getMessageBodyField().type('Testing Save Drafts with Attachments');
  };

  getMessageSubjectField = () => {
    return cy
      .get('[data-testid="message-subject-field"]')
      .shadow()
      .find('[name="message-subject"]');
  };

  getMessageBodyField = () => {
    return cy
      .get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="message-body"]');
  };
}
export default PatientMessageDraftsPage;
