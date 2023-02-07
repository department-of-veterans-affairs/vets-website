import mockCategories from '../fixtures/categories-response.json';
import mockFolders from '../fixtures/folder-response.json';
import mockInboxFolder from '../fixtures/folder-inbox-response.json';
import mockMessages from '../fixtures/messages-response.json';
import mockRecipients from '../fixtures/recipients-response.json';
import mockMessage from '../fixtures/message-response-specialchars.json';
import mockThread from '../fixtures/thread-response.json';
import mockNoRecipients from '../fixtures/no-recipients-response.json';
import mockInboxNoMessages from '../fixtures/empty-thread-response.json';
import mockMessagewithAttachment from '../fixtures/message-response-withattachments.json';
import mockThreadwithAttachment from '../fixtures/thread-attachment-response.json';

class PatientInboxPage {
  newMessageIndex = 0;

  loadedMessagesData = undefined;

  loadPage = (doAxeCheck = false) => {
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
    cy.wait('@inboxMessages');
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

  loadMessageDetails = (messageId, messageTitle, messageDate) => {
    cy.log('loading message details.');
    cy.log(`Sent date: ${messageDate}`);
    mockMessage.data.attributes.sentDate = messageDate;
    mockMessage.data.attributes.messageId = messageId;
    mockMessage.data.attributes.messageTitle = messageTitle;
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
    cy.contains(messageTitle).click();
    cy.wait('@message');
    cy.wait('@full-thread');
  };

  loadMessageDetailsByTabbingAndEnterKey = inputMockMessage => {
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        inputMockMessage.attributes.messageId
      }`,
      mockMessage,
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
      mockMessage,
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

  loadComposeMessagePage = () => {
    cy.get('[data-testid="compose-message-link"]').click();
  };
}

export default PatientInboxPage;
