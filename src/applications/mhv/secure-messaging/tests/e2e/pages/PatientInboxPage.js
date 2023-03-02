import mockCategories from '../fixtures/categories-response.json';
import mockFolders from '../fixtures/folder-response.json';
import mockInboxFolder from '../fixtures/folder-inbox-response.json';
import mockMessages from '../fixtures/messages-response.json';
import mockRecipients from '../fixtures/recipients-response.json';
import mockSpecialCharsMessage from '../fixtures/message-response-specialchars.json';
import mockThread from '../fixtures/thread-response.json';
import mockNoRecipients from '../fixtures/no-recipients-response.json';
import mockInboxNoMessages from '../fixtures/empty-thread-response.json';
import mockMessagewithAttachment from '../fixtures/message-response-withattachments.json';
import mockThreadwithAttachment from '../fixtures/thread-attachment-response.json';

class PatientInboxPage {
  newMessageIndex = 0;

  dynamicMessageId = undefined;

  dynamicMessageBody = undefined;

  dynamicMessageTitle = undefined;

  dynamicMessageCategory = undefined;

  dynamicMessageDate = undefined;

  dynamicMessageRecipient = undefined;

  useDynamicData = false;

  mockInboxMessages = mockMessages;

  mockDetailedMessage = mockSpecialCharsMessage;

  setDynamicMessage = (
    messageId,
    messageTitle,
    messageBody,
    messageCategory,
    messageDate,
    messageRecipient,
  ) => {
    this.useDynamicData = true;
    this.dynamicMessageId = messageId;
    this.dynamicMessageBody = messageBody;
    this.dynamicMessageTitle = messageTitle;
    this.dynamicMessageCategory = messageCategory;
    this.dynamicMessageDate = messageDate;
    this.dynamicMessageRecipient = messageRecipient;
    cy.log(`dynameic message Title = ${this.dynamicMessageTitle}`);
  };

  loadInboxMessages = (
    inboxMessages,
    detailedMessage,
    getFoldersStatus = 200,
  ) => {
    this.mockInboxMessages = inboxMessages;
    this.setInboxTestMessageDetails(detailedMessage);
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'mhv_secure_messaging_to_va_gov_release',
            value: true,
          },
        ],
      },
    }).as('featureToggle');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/categories',
      mockCategories,
    ).as('categories');
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
    cy.log(
      `message id = ${this.mockInboxMessages.data.at(0).attributes.messageId}`,
    );
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages*',
      this.mockInboxMessages,
    ).as('inboxMessages');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0*',
      mockInboxFolder,
    ).as('inboxFolderMetaData');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/recipients?useCache=false',
      mockRecipients,
    ).as('recipients');
    cy.visit('my-health/secure-messages/inbox', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });

    cy.wait('@folders');
    cy.wait('@featureToggle');
    cy.wait('@mockUser');
    cy.wait('@inboxMessages').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
  };

  setInboxTestMessageDetails = mockMessage => {
    this.mockInboxMessages.data.at(0).attributes.sentDate =
      mockMessage.data.attributes.sentDate;
    this.mockInboxMessages.data.at(0).attributes.messageId = mockMessage.id;
    this.mockInboxMessages.data.at(0).attributes.subject =
      mockMessage.data.attributes.subject;
    this.mockInboxMessages.data.at(0).attributes.body =
      mockMessage.data.attributes.body;
    this.mockInboxMessages.data.at(0).attributes.category =
      mockMessage.data.attributes.category;
    mockThread.data.at(0).attributes.recipientId =
      mockMessage.data.attributes.recipientId;

    this.mockDetailedMessage = mockMessage;
  };

  getInboxTestMessageDetails = () => {
    return this.mockDetailedMessage;
  };

  loadPage = (doAxeCheck = false, getFoldersStatus = 200) => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    this.loadedMessagesData = mockMessages;
    mockMessages.data.at(
      this.newMessageIndex,
    ).attributes.sentDate = date.toISOString();

    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'mhv_secure_messaging_to_va_gov_release',
            value: true,
          },
        ],
      },
    }).as('featureToggle');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/categories',
      mockCategories,
    ).as('categories');
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
    cy.log(
      `message title = ${mockMessages.data.at(0).attributes.messageTitle}`,
    );
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages*',
      mockMessages,
    ).as('inboxMessages');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0*',
      mockInboxFolder,
    ).as('inboxFolderMetaData');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/recipients?useCache=false',
      mockRecipients,
    ).as('recipients');
    cy.visit('my-health/secure-messages/inbox', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });
    if (doAxeCheck) {
      cy.injectAxe();
    }

    cy.wait('@folders');
    cy.wait('@featureToggle');
    cy.wait('@mockUser');
    cy.wait('@inboxMessages').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
    if (doAxeCheck) {
      cy.axeCheck();
    }
  };

  loadEmptyPage = (doAxeCheck = false) => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    mockMessages.data.at(
      this.newMessageIndex,
    ).attributes.sentDate = date.toISOString();
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'mhv_secure_messaging_to_va_gov_release',
            value: true,
          },
        ],
      },
    }).as('featureToggle');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/categories',
      mockCategories,
    ).as('categories');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders?page*',
      mockFolders,
    ).as('folders');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages*',
      mockInboxNoMessages,
    ).as('inboxMessages');
    this.loadedMessagesData = mockInboxNoMessages;
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0*',
      mockInboxFolder,
    ).as('inboxFolderMetaData');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/recipients?useCache=false',
      mockRecipients,
    ).as('recipients');
    cy.visit('my-health/secure-messages/inbox');
    if (doAxeCheck) {
      cy.injectAxe();
    }

    cy.wait('@folders');
    cy.wait('@featureToggle');
    cy.wait('@mockUser');
    if (doAxeCheck) {
      cy.axeCheck();
    }
  };

  loadMessageDetails = (
    messageId,
    messageTitle,
    messageBody,
    messageCategory,
    messageDate,
    messageRecipient,
  ) => {
    cy.log('loading message details.');
    cy.log(`Sent date: ${messageDate}`);
    mockSpecialCharsMessage.data.attributes.sentDate = messageDate;
    mockSpecialCharsMessage.data.attributes.messageId = messageId;
    mockSpecialCharsMessage.data.attributes.subject = messageTitle;
    mockSpecialCharsMessage.data.attributes.body = messageBody;
    mockSpecialCharsMessage.data.attributes.category = messageCategory;
    mockSpecialCharsMessage.data.attributes.messageRecipient = messageRecipient;

    mockThread.data.at(0).attributes.sentDate = messageDate;
    mockThread.data.at(0).attributes.messageId = messageId;
    mockThread.data.at(0).attributes.subject = messageTitle;
    mockThread.data.at(0).attributes.body = messageBody;
    mockThread.data.at(0).attributes.category = messageCategory;
    mockThread.data.at(0).attributes.messageRecipient = messageRecipient;
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${messageId}`,
      mockSpecialCharsMessage,
    ).as('message');
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${messageId}/thread`,
      mockThread,
    ).as('full-thread');
    cy.contains(messageTitle).click();
    cy.wait('@message').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
    cy.wait('@full-thread');
  };

  loadMessageDetailsByTabbingAndEnterKey = inputMockMessage => {
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        inputMockMessage.attributes.messageId
      }`,
      mockSpecialCharsMessage,
    ).as('message');
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        inputMockMessage.attributes.messageId
      }/thread`,
      mockThread,
    ).as('full-thread');
    cy.tabToElement(
      `a[href*="/my-health/secure-messages/message/${
        inputMockMessage.attributes.messageId
      }"]`,
    );
    cy.realPress(['Enter']);
    cy.wait('@message');
    cy.wait('@full-thread');
  };

  loadMessageDetailsWithData = inputMockMessage => {
    cy.log('loading message details.');

    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${inputMockMessage.data.id}`,
      mockSpecialCharsMessage,
    ).as('message');
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${inputMockMessage.data.id}/thread`,
      mockThread,
    ).as('full-thread');
    cy.contains(inputMockMessage.data.attributes.subject).click();
    cy.wait('@message');
    cy.wait('@full-thread');
  };

  loadMessagewithAttachments = mockMessagewithAttach => {
    cy.log('loading message with attachments');
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${mockMessagewithAttach.data.id}`,
      mockMessagewithAttachment,
    ).as('message');
    cy.intercept(
      'GET',
      `my_health/v1/messaging/messages/${mockMessagewithAttach.data.id}/thread`,
      mockThreadwithAttachment,
    ).as('thread');
  };

  getNewMessage = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    mockMessages.data.at(
      this.newMessageIndex,
    ).attributes.sentDate = date.toISOString();
    return mockMessages.data.at(this.newMessageIndex);
  };

  getExpired46DayOldMessage = () => {
    const date = new Date();
    date.setDate(date.getDate() - 46);
    mockMessages.data.at(
      this.newMessageIndex,
    ).attributes.sentDate = date.toISOString();
    return mockMessages.data.at(this.newMessageIndex);
  };

  loadPageForNoProvider = (doAxeCheck = false) => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    mockMessages.data.at(
      this.newMessageIndex,
    ).attributes.sentDate = date.toISOString();
    cy.intercept('GET', '/v0/feature_toggles?*', {
      data: {
        type: 'feature_toggles',
        features: [
          {
            name: 'mhv_secure_messaging_to_va_gov_release',
            value: true,
          },
        ],
      },
    }).as('featureToggle');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/categories',
      mockCategories,
    ).as('categories');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders?page*',
      mockFolders,
    ).as('folders');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages*',
      mockMessages,
    ).as('inboxMessages');
    this.loadedMessagesData = mockMessages;
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0*',
      mockInboxFolder,
    ).as('inboxFolderMetaData');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/recipients?useCache=false',
      mockNoRecipients,
    ).as('recipients');
    cy.visit('my-health/secure-messages/inbox');
    if (doAxeCheck) {
      cy.injectAxe();
    }

    cy.wait('@folders');
    cy.wait('@featureToggle');
    cy.wait('@mockUser');
    if (doAxeCheck) {
      cy.axeCheck();
    }
  };

  getLoadedMessages = () => {
    return this.loadedMessagesData;
  };

  verifySentSuccessMessage = () => {
    cy.contains('Message was successfully sent.').should('be.visible');
  };

  verifyMoveMessagewithAttachmentSuccessMessage = () => {
    cy.get('[data-testid="expired-alert-message"]').contains('Success');
    cy.get('p').contains('Message was successfully moved');
  };

  loadComposeMessagePage = () => {
    cy.get('[data-testid="compose-message-link"]').click();
  };

  navigatePrintCancelButton = () => {
    cy.tabToElement('[class="usa-button-secondary"]');
    cy.realPress(['Enter']);
    cy.get('[data-testid="radio-print-one-message"]').should('be.visible');
    cy.get('[data-testid="print-modal-popup"]')
      .shadow()
      .find('button')
      .contains('Cancel')
      .realPress(['Enter']);
  };

  navigateTrash = () => {
    cy.tabToElement(':nth-child(2) > .usa-button-secondary');
    cy.realPress(['Enter']);
    cy.get('[data-testid="delete-message-confirm-note"] p')
      .contains('Messages in the trash folder')
      .should('be.visible');
    cy.get('[data-testid="delete-message-modal"]')
      .shadow()
      .find('button')
      .contains('Cancel')
      .realPress(['Enter']);
  };

  navigateReply = () => {
    cy.tabToElement('[data-testid="reply-button-top"]');
    cy.realPress(['Enter']);
  };
}

export default PatientInboxPage;
