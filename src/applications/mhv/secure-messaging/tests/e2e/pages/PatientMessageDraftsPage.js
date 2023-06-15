import mockDraftFolderMetaResponse from '../fixtures/folder-drafts-metadata.json';
import mockDraftMessagesResponse from '../fixtures/drafts-response.json';
import mockDraftResponse from '../fixtures/message-draft-response.json';
import defaultMockThread from '../fixtures/single-draft-response.json';

class PatientMessageDraftsPage {
  mockDraftMessages = mockDraftMessagesResponse;

  mockDetailedMessage = mockDraftResponse;

  currentThread = defaultMockThread;

  loadDraftMessages = (
    draftMessages = mockDraftMessagesResponse,
    detailedMessage = mockDraftResponse,
  ) => {
    this.mockDraftMessages = draftMessages;
    cy.log(
      `draft messages before set Draft Test Message Details = ${JSON.stringify(
        this.mockDraftMessages,
      )}`,
    );
    this.setDraftTestMessageDetails(detailedMessage);

    cy.log(`draft messages  = ${JSON.stringify(this.mockDraftMessages)}`);
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2',
      mockDraftFolderMetaResponse,
    ).as('draftsFolderMetaResponse');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2/threads**',
      this.mockDraftMessages,
    ).as('draftsResponse');
    cy.get('[data-testid="drafts-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    // cy.wait('@draftsFolderMetaResponse');
    // cy.wait('@draftsResponse');
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
    // this.currentThread.data.at(0).attributes.sentDate =
    //  mockParentMessageDetails.data.attributes.sentDate;
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
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    cy.wait('@message1');
    cy.wait('@full-thread');
  };

  clickDeleteButton = () => {
    cy.get('[data-testid="delete-draft-button"]').click({ force: true });
  };

  confirmDeleteDraft = draftMessage => {
    cy.intercept(
      'DELETE',
      `/my_health/v1/messaging/messages/${
        draftMessage.data.attributes.messageId
      }`,
      draftMessage,
    ).as('deletedDraftResponse');
    cy.get('[data-testid="delete-draft-modal"] > p').should('be.visible');
    cy.get('[data-testid="delete-draft-modal"]')
      .shadow()
      .find('[type ="button"]', { force: true })
      .contains('Delete draft')
      .should('contain', 'Delete')
      .click({ force: true });
    cy.wait('@deletedDraftResponse');
  };

  confirmDeleteDraftWithEnterKey = draftMessage => {
    cy.intercept(
      'DELETE',
      `/my_health/v1/messaging/messages/${
        draftMessage.data.attributes.messageId
      }`,
      draftMessage,
    ).as('deletedDraftResponse');
    cy.get('[data-testid="delete-draft-modal"] > p').should('be.visible');
    cy.tabToElement('[data-testid="delete-draft-modal"]').realPress(['Enter']);
    cy.wait('@deletedDraftResponse');
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
      .find('[name="compose-message-body"]');
  };

  verifySendMessageConfirmationMessage = () => {
    cy.get('.vads-u-margin-bottom--1').should(
      'have.text',
      'Secure message was successfully sent.',
    );
  };

  openAdvancedSearch = () => {
    cy.get('#first').click();
  };

  selectAdvancedSearchCategory = () => {
    cy.get('#category-dropdown')
      .find('#select')
      .select('COVID');
  };

  submitSearchButton = () => {
    cy.get('[data-testid="filter-messages-button"]').click();
  };

  selectRecipientName = recipientName => {
    cy.get('[data-testid="compose-recipient-select"]')
      .shadow()
      .find('select')
      .select(recipientName);
  };

  selectCategory = category => {
    cy.get('[data-testid="compose-category-radio-button"]')
      .shadow()
      .contains(category)
      .click();
  };

  addMessageSubject = subject => {
    cy.get('[data-testid="message-subject-field"]')
      .shadow()
      .find('#inputField')
      .type(subject);
  };

  addMessageBody = text => {
    cy.get('#compose-message-body')
      .shadow()
      .find('#textarea')
      .type(text);
  };

  saveDraftByKeyboard = () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/message_drafts',
      mockDraftResponse,
    ).as('draft_message');
    cy.tabToElement('#save-draft-button');
    cy.realPress('Enter');
    cy.wait('@draft_message').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
  };

  verifyFocusOnConfirmationMessage = () => {
    cy.get('.last-save-time').should('have.focus');
  };
}

export default PatientMessageDraftsPage;
