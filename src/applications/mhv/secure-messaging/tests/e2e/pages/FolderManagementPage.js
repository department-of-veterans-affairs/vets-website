import mockCustomResponse from '../fixtures/custom-response.json';
import defaultMockThread from '../fixtures/thread-response.json';
import mockMessageResponse from '../fixtures/message-custom-response.json';

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

  clickAndLoadCustomFolder = (
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

  selectFolderfromModal = () => {
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockMessageResponse.data.at(1).attributes.messageId
      }`,
      mockMessageResponse,
    );
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockMessageResponse.data.at(2).attributes.messageId
      }`,
      mockMessageResponse,
    );
    cy.get('[data-testid="move-button-text"]').click();
    cy.get('[data-testid = "move-to-modal"')

      .find('[class = "form-radio-buttons hydrated"]', {
        includeShadowDom: true,
      })
      .find('[id = "radiobutton-Deleted"]', { includeShadowDom: true })
      .click();
  };

  moveCustomFolderMessageToDifferentFolder = () => {
    cy.intercept(
      'PATCH',
      `/my_health/v1/messaging/threads/${
        mockCustomResponse.data.attributes.threadId
      }/move?folder_id=-3`,
      mockCustomResponse,
    ).as('moveMockCustomResponse');
    cy.get('[data-testid="move-to-modal"]')
      .shadow()
      .find('button')
      .contains('Confirm')
      .click();
    // cy.wait('@mockCustomResponse');
  };

  foldersSelectors = ['Deleted', 'TEST2', 'TESTAGAIN', 'newFolder'];

  moveInboxFolderMessageToDifferentFolder = (
    folderId = -3,
    folderName = this.foldersSelectors[0],
  ) => {
    cy.intercept(
      'PATCH',
      `my_health/v1/messaging/threads/7176615/move?folder_id=${folderId}`,
      {},
    );
    cy.get('[data-testid="move-button-text"]').click();
    cy.get(`[data-testid="radiobutton-${folderName}"]`)
      .should('exist')
      .click();
    cy.get('#modal-primary-button').click();
  };

  verifyMoveMessageSuccessConfirmationFocus = () => {
    cy.get('[close-btn-aria-label="Close notification"]')
      .should('exist')
      .and('have.text', 'Message conversation was successfully moved.');
  };
}

export default FolderManagementPage;
