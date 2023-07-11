import mockCategories from '../fixtures/categories-response.json';
import mockFolders from '../fixtures/folder-response.json';
import mockInboxFolder from '../fixtures/folder-inbox-response.json';
import mockMessages from '../fixtures/messages-response.json';
import mockRecipients from '../fixtures/recipients-response.json';
import mockSpecialCharsMessage from '../fixtures/message-response-specialchars.json';
import mockMessageDetails from '../fixtures/message-response.json';
import mockThread from '../fixtures/thread-response.json';
import mockNoRecipients from '../fixtures/no-recipients-response.json';
import PatientInterstitialPage from './PatientInterstitialPage';
import mockDraftResponse from '../fixtures/message-compose-draft-response.json';

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

  mockRecipients = mockRecipients;

  loadInboxMessages = (
    inboxMessages = mockMessages,
    detailedMessage = mockSpecialCharsMessage,
    recipients = mockRecipients,
    getFoldersStatus = 200,
  ) => {
    this.mockInboxMessages = inboxMessages;
    this.mockRecipients = recipients;
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
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/threads?pageSize=10&pageNumber=1&sortField=SENT_DATE&sortOrder=DESC',
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
      this.mockRecipients,
    ).as('recipients');
    cy.visit('my-health/secure-messages/inbox/', {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });

    cy.wait('@folders');
    cy.wait('@featureToggle');
    cy.wait('@mockUser');
    cy.wait('@inboxMessages');
    if (this.mockInboxMessages.length) cy.get('.thread-list').should('exist');
  };

  setInboxTestMessageDetails = mockMessage => {
    if (this.mockInboxMessages.data.length > 0) {
      cy.log(`mockInboxMessages size ${this.mockInboxMessages.data.length}`);
      this.mockInboxMessages.data.at(0).attributes.sentDate =
        mockMessage.data.attributes.sentDate;
      this.mockInboxMessages.data.at(0).attributes.messageId =
        mockMessage.data.attributes.messageId;
      this.mockInboxMessages.data.at(0).attributes.subject =
        mockMessage.data.attributes.subject;
      this.mockInboxMessages.data.at(0).attributes.body =
        mockMessage.data.attributes.body;
      this.mockInboxMessages.data.at(0).attributes.category =
        mockMessage.data.attributes.category;
      mockThread.data.at(0).attributes.recipientId =
        mockMessage.data.attributes.recipientId;
      mockThread.data.at(0).attributes.triageGroupName =
        mockMessage.data.attributes.triageGroupName;
      this.mockDetailedMessage = mockMessage;
    }
  };

  getInboxTestMessageDetails = () => {
    return this.mockDetailedMessage;
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

  getNewMessage = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    mockMessages.data.at(
      this.newMessageIndex,
    ).attributes.sentDate = date.toISOString();
    return mockMessages.data.at(this.newMessageIndex);
  };

  getNewMessageDetails = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const newMessage = mockMessageDetails;
    newMessage.data.attributes.sentDate = date.toISOString();
    return newMessage;
  };

  setMessageDateToYesterday = mockMessage => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const newMessage = mockMessage;
    newMessage.data.attributes.sentDate = date.toISOString();
    return newMessage;
  };

  getExpired46DayOldMessage = () => {
    const date = new Date();
    date.setDate(date.getDate() - 46);
    mockMessages.data.at(
      this.newMessageIndex,
    ).attributes.sentDate = date.toISOString();
    return mockMessages.data.at(this.newMessageIndex);
  };

  getExpired46DayOldMessageDetails = () => {
    const date = new Date();
    date.setDate(date.getDate() - 46);
    const newMessage = mockMessageDetails;
    newMessage.data.attributes.sentDate = date.toISOString();
    return newMessage;
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
      '/my_health/v1/messaging/folders/0/threads?pageSize=10&pageNumber=1&sortField=SENT_DATE&sortOrder=DESC',
      this.mockInboxMessages,
    ).as('inboxMessages');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0*',
      mockInboxFolder,
    ).as('inboxFolderMetaData');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/threads?pageSize=10&pageNumber=1&sortField=SENT_DATE&sortOrder=DESC',
      this.mockInboxMessages,
    ).as('inboxMessages');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/recipients?useCache=false',
      mockNoRecipients,
    ).as('recipients');
    cy.visit('my-health/secure-messages/inbox/');
    if (doAxeCheck) {
      cy.injectAxe();
    }

    cy.wait('@folders');
    cy.wait('@featureToggle');
    cy.wait('@mockUser');
    if (doAxeCheck) {
      cy.axeCheck('main', {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
    }
  };

  clickInboxSideBar = () => {};

  clickSentSideBar = () => {};

  clickTrashSideBar = () => {};

  clickDraftsSideBar = () => {};

  clickMyFoldersSideBar = () => {};

  getLoadedMessages = () => {
    return this.loadedMessagesData;
  };

  verifySentSuccessMessage = () => {
    cy.contains('Secure message was successfully sent.').should('be.visible');
  };

  verifyMoveMessagewithAttachmentSuccessMessage = () => {
    cy.get('p').contains('Message conversation was successfully moved');
  };

  interstitialStartMessage = type => {
    return cy
      .get('a')
      .contains(`Continue to ${!type ? 'start message' : type} `);
  };

  navigateToComposePage = () => {
    cy.get('[data-testid="compose-message-link"]').click({ force: true });
    const interstitialPage = new PatientInterstitialPage();
    interstitialPage.getContinueButton().click({ force: true });
  };

  navigateToComposePageByKeyboard = () => {
    cy.tabToElement('[data-testid="compose-message-link"]');
    cy.realPress(['Enter']);
    cy.tabToElement('[data-testid="continue-button"]');
    cy.realPress(['Enter']);
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
    cy.tabToElement('[data-testid="reply-button-body"]');
    cy.realPress(['Enter']);
  };

  verifyDeleteConfirmMessage = () => {
    cy.contains('successfully deleted')
      .focused()
      .should('have.text', 'Draft was successfully deleted.');
  };

  loadLandingPagebyTabbingandEnterKey = () => {
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages?per_page=-1&useCache=false',
      mockFolders,
    ).as('folders');
  };

  openAdvancedSearch = () => {
    cy.get('#additional-filter-accordion')
      .shadow()
      .contains('Add filters')
      .click({
        waitForAnimations: true,
      });
  };

  selectAdvancedSearchCategory = () => {
    cy.get('#category-dropdown')
      .find('#select')
      .select('COVID');
  };

  selectAdvancedSearchCategoryCustomFolder = () => {
    cy.get('#category-dropdown')
      .find('#select')
      .select('Medication');
  };

  submitSearchButton = () => {
    cy.get('[data-testid="filter-messages-button"]').click({
      waitForAnimations: true,
    });
  };

  composeDraftByKeyboard = () => {
    cy.tabToElement('#recipient-dropdown')
      .shadow()
      .find('#select')
      .select(1, { force: true });
    cy.tabToElement('[data-testid="compose-category-radio-button"]')
      .first()
      .click();
    cy.tabToElement('[data-testid="message-subject-field"]')
      .shadow()
      .find('#inputField')
      .type('testSubject');
    cy.tabToElement('#compose-message-body')
      .shadow()
      .find('#textarea')
      .type('testMessage');
  };

  saveDraftByKeyboard = () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/message_drafts',
      mockDraftResponse,
    ).as('draft_message');
    cy.tabToElement('[data-testid="Save-Draft-Button"]');
    cy.realPress('Enter');
    cy.wait('@draft_message').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
  };
}

export default PatientInboxPage;
