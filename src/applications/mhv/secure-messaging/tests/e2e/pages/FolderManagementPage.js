import mockCustomResponse from '../fixtures/custom-response.json';
import defaultMockThread from '../fixtures/thread-response.json';

class FolderManagementPage {
  currentThread = defaultMockThread;

  createANewFolderButton = () => {
    return cy
      .get('[text="Create new folder"]')
      .shadow()
      .find('[type="button"]');
  };

  editFolderNameButton = () => {
    return cy.get('[data-testid="edit-folder-button"]');
  };

  createFolderTextBox = () => {
    return cy
      .get('[name="folder-name"]')
      .shadow()
      .find('[name="folder-name"]');
  };

  createFolderModalButton = () => {
    return cy
      .get('[text="Create"]')
      .shadow()
      .find('[type="button"]');
  };

  clickAndLoadCustumFolder = (
    folderName,
    folderId,
    folderData,
    folderMessages,
  ) => {
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderId}`,
      folderData,
    ).as('customFolderID');

    cy.intercept(
      'GET',
      `/my_health/v1/messaging/folders/${folderId}/threads*`,
      folderMessages,
    ).as('customFolderMessages');

    cy.contains(folderName).click();
    cy.wait('@customFolderMessages');
  };

  currentThread = defaultMockThread;

  loadCustomFolderMessageDetails = (
    mockParentMessageDetails,
    mockThread = defaultMockThread,
    previousMessageIndex = 1,
    mockPreviousMessageDetails = mockCustomResponse,
  ) => {
    this.currentThread = mockThread;

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
    if (this.currentThread.data.lenghth > 1) {
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
      this.currentThread.data.at(
        previousMessageIndex,
      ).attributes.recipientName =
        mockPreviousMessageDetails.data.attributes.recipientName;
      this.currentThread.data.at(
        previousMessageIndex,
      ).attributes.triageGroupName =
        mockPreviousMessageDetails.data.attributes.triageGroupName;
    }
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
    cy.injectAxe();
    cy.axeCheck();
    cy.wait('@message1');
    // cy.wait('@full-thread');
  };

  folderConfirmation = () => {
    return cy.get('[class="vads-u-margin-y--0"]');
  };

  verifyDeleteSuccessMessage = () => {
    this.folderConfirmation().should(
      'have.text',
      'Folder was successfully removed.',
    );
  };

  verifyCreateFolderNetworkFailureMessage = () => {
    this.folderConfirmation().should(
      'have.text',
      'Folder could not be created. Try again later. If this problem persists, contact the help desk.',
    );
  };

  verifyCreateFolderSuccessMessage = () => {
    this.folderConfirmation().should(
      'have.text',
      'Folder was successfully created.',
    );
  };
}
export default FolderManagementPage;
