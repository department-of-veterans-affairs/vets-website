import folderSentMetadata from '../fixtures/folder-sent-metadata.json';
import mockMessages from '../fixtures/messages-response.json';
import mockRecipients from '../fixtures/recipients-response.json';
import mockSpecialCharsMessage from '../fixtures/message-response-specialchars.json';
import mockThread from '../fixtures/thread-response.json';

class PatientSentPage {
  mockSentMessages = mockMessages;

  mockDetailedMessage = mockSpecialCharsMessage;

  mockRecipients = mockRecipients;

  loadSentMessages = (
    sentMessages = mockMessages,
    detailedMessage = mockSpecialCharsMessage,
  ) => {
    this.mockSentMessages = sentMessages;
    this.setSentTestMessageDetails(detailedMessage);
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1/threads*',
      this.mockSentMessages,
    ).as('sentMessages');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1*',
      folderSentMetadata,
    ).as('sentFolderMetaData');
    cy.get('[data-testid="sent-sidebar"]').click();

    cy.wait('@sentMessages');
  };

  setSentTestMessageDetails = mockMessage => {
    if (this.mockSentMessages.data.length > 0) {
      cy.log(`mockSentMessages size ${this.mockSentMessages.data.length}`);
      this.mockSentMessages.data.at(0).attributes.sentDate =
        mockMessage.data.attributes.sentDate;
      this.mockSentMessages.data.at(0).attributes.messageId =
        mockMessage.data.attributes.messageId;
      this.mockSentMessages.data.at(0).attributes.subject =
        mockMessage.data.attributes.subject;
      this.mockSentMessages.data.at(0).attributes.body =
        mockMessage.data.attributes.body;
      this.mockSentMessages.data.at(0).attributes.category =
        mockMessage.data.attributes.category;
      mockThread.data.at(0).attributes.recipientId =
        mockMessage.data.attributes.recipientId;
      mockThread.data.at(0).attributes.triageGroupName =
        mockMessage.data.attributes.triageGroupName;
      this.mockDetailedMessage = mockMessage;
    }
  };
}
export default PatientSentPage;
