import mockCategories from '../fixtures/categories-response.json';
import mockFolders from '../fixtures/folder-response.json';
import mockSignature from '../fixtures/signature-response.json';
import mockInboxFolder from '../fixtures/folder-inbox-response.json';
import mockMessages from '../fixtures/messages-response.json';
import mockRecipients from '../fixtures/recipients-response.json';
import mockSpecialCharsMessage from '../fixtures/message-response-specialchars.json';
import mockMessageDetails from '../fixtures/message-response.json';
import mockThread from '../fixtures/thread-response.json';
import mockNoRecipients from '../fixtures/no-recipients-response.json';
import PatientInterstitialPage from './PatientInterstitialPage';
import { AXE_CONTEXT, Locators, Paths } from '../utils/constants';
import inboxSearchResponse from '../fixtures/inboxResponse/filtered-inbox-messages-response.json';
import mockSortedMessages from '../fixtures/inboxResponse/sorted-inbox-messages-response.json';
import mockSingleThread from '../fixtures/inboxResponse/single-thread-response.json';
import mockSingleMessage from '../fixtures/inboxResponse/single-message-response.json';
import mockFirstMessage from '../fixtures/first-message-from-thread-response.json';

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
    detailedMessage = mockSingleMessage,
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
      Paths.SM_API_EXTENDED + Paths.CATEGORIES,
      mockCategories,
    ).as('categories');
    if (getFoldersStatus === 200) {
      cy.intercept(
        'GET',
        `${Paths.SM_API_BASE + Paths.FOLDERS}*`,
        mockFolders,
      ).as('folders');
    } else {
      cy.intercept('GET', `${Paths.SM_API_BASE + Paths.FOLDERS}/*`, {
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
      `${Paths.SM_API_BASE + Paths.FOLDERS}/0/threads*`,
      this.mockInboxMessages,
    ).as('inboxMessages');
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/0*`,
      mockInboxFolder,
    ).as('inboxFolderMetaData');
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.RECIPIENTS}*`,
      this.mockRecipients,
    ).as('recipients');

    cy.intercept(
      'GET',
      Paths.SM_API_EXTENDED + Paths.SIGNATURE,
      mockSignature,
    ).as('signature');

    cy.visit(Paths.UI_MAIN + Paths.INBOX, {
      onBeforeLoad: win => {
        cy.stub(win, 'print');
      },
    });

    cy.wait('@featureToggle');
    cy.wait('@mockUser');
    cy.wait('@inboxMessages', { requestTimeout: 10000 });
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
      Paths.SM_API_EXTENDED + inputMockMessage.attributes.messageId,
      mockSpecialCharsMessage,
    ).as('message');
    cy.intercept(
      'GET',
      `${Paths.SM_API_EXTENDED + inputMockMessage.attributes.messageId}/thread`,
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

  loadSingleThread = (testSingleThread = mockThread) => {
    this.singleThread = testSingleThread;
    const currentDate = new Date();
    this.singleThread.data[0].attributes.sentDate = currentDate.toISOString();
    cy.log('loading single thread details.');
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}*`,
      mockFolders,
    ).as('folders');
    cy.intercept(
      'GET',
      `${Paths.SM_API_EXTENDED}/${
        mockMessages.data[0].attributes.messageId
      }/thread`,
      this.singleThread,
    ).as('full-thread');
    cy.intercept(
      'GET',
      `${Paths.SM_API_EXTENDED}/${
        this.singleThread.data[0].attributes.messageId
      }`,
      mockFirstMessage,
    ).as('fist-message-in-thread');

    cy.contains(mockMessages.data[0].attributes.subject).click({
      waitForAnimations: true,
    });
    cy.wait('@full-thread', { requestTimeout: 20000 });
    cy.wait('@fist-message-in-thread');
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
    cy.intercept(
      'GET',
      Paths.SM_API_EXTENDED + Paths.SIGNATURE,
      mockSignature,
    ).as('signature');
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
      Paths.SM_API_EXTENDED + Paths.CATEGORIES,
      mockCategories,
    ).as('categories');
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/*`,
      mockFolders,
    ).as('folders');
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/0/messages*`,
      mockMessages,
    ).as('inboxMessages');
    this.loadedMessagesData = mockMessages;
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/0/threads*`,
      this.mockInboxMessages,
    ).as('inboxMessages');
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/0*`,
      mockInboxFolder,
    ).as('inboxFolderMetaData');
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/0/threads*`,
      this.mockInboxMessages,
    ).as('inboxMessages');
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.RECIPIENTS}*`,
      mockNoRecipients,
    ).as('recipients');
    cy.visit(Paths.UI_MAIN + Paths.INBOX);
    if (doAxeCheck) {
      cy.injectAxe();
    }

    // cy.wait('@folders');
    cy.wait('@featureToggle');
    cy.wait('@mockUser');
    if (doAxeCheck) {
      cy.axeCheck(AXE_CONTEXT, {
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

  clickMyFoldersSideBar = () => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}*`,
      mockFolders,
    ).as('folders');
    cy.get(Locators.FOLDERS_LIST).click();
    cy.wait('@folders');
  };

  getLoadedMessages = () => {
    return this.loadedMessagesData;
  };

  replyToMessage = () => {
    const currentDate = new Date();
    mockSingleThread.data[0].attributes.sentDate = currentDate.toISOString();
    cy.intercept('GET', `${Paths.SM_API_BASE}/folders*`, mockFolders);
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE}/messages/${
        mockSingleThread.data[0].attributes.messageId
      }/thread`,
      mockSingleThread,
    ).as('singleThread');
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE}/messages/${
        mockSingleThread.data[0].attributes.messageId
      }`,
      mockSingleMessage,
    ).as('singleThread');
    cy.get(Locators.THREADS)
      .first()
      .find(`#message-link-${mockSingleThread.data[0].attributes.messageId}`)
      .click({ waitForAnimations: true });
    cy.get(Locators.BUTTONS.REPLY).click({
      waitForAnimations: true,
    });
    cy.get(Locators.BUTTONS.CONTINUE).click();
  };

  verifySentSuccessMessage = () => {
    cy.contains('Secure message was successfully sent.').should('be.visible');
  };

  verifyMoveMessageWithAttachmentSuccessMessage = () => {
    cy.get('p').contains('Message conversation was successfully moved');
  };

  interstitialStartMessage = type => {
    return cy
      .get('a')
      .contains(`Continue to ${!type ? 'start message' : type} `);
  };

  navigateToComposePage = (checkFocusOnVcl = false) => {
    cy.intercept(
      'GET',
      Paths.SM_API_EXTENDED + Paths.SIGNATURE,
      mockSignature,
    ).as('signature');
    cy.get('[data-testid="compose-message-link"]').click({ force: true });
    cy.wait('@signature');
    if (checkFocusOnVcl) {
      PatientInterstitialPage.CheckFocusOnVcl();
    }
    PatientInterstitialPage.getContinueButton().click({ force: true });
  };

  navigateToInterstitialPage = () => {
    cy.intercept(
      'GET',
      Paths.SM_API_EXTENDED + Paths.SIGNATURE,
      mockSignature,
    ).as('signature');
    cy.get('[data-testid="compose-message-link"]').click({ force: true });
    cy.wait('@signature');
  };

  navigateToComposePageByKeyboard = () => {
    cy.tabToElement(Locators.InboxPage.COMPOSE_MESSAGE);
    cy.realPress(['Enter']);
    cy.tabToElement(Locators.BUTTONS.CONTINUE);
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

  loadLandingPageByTabbingAndEnterKey = () => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE +
        Paths.FOLDERS}/0/messages?per_page=-1&useCache=false`,
      mockFolders,
    ).as('folders');
  };

  openAdvancedSearch = () => {
    cy.get('#additional-filter-accordion')
      .shadow()
      .contains('Add filters')
      .click({
        waitForAnimations: true,
        force: true,
      });
  };

  selectAdvancedSearchCategory = text => {
    cy.get('#category-dropdown')
      .find('#select')
      .select(text, { force: true });
  };

  selectAdvancedSearchCategoryCustomFolder = () => {
    cy.get('#category-dropdown')
      .find('#select')
      .select('Medication');
  };

  submitSearchButton = () => {
    cy.get(Locators.BUTTONS.FILTER).click({
      waitForAnimations: true,
      force: true,
    });
  };

  composeMessage = () => {
    cy.get('#recipient-dropdown')
      .shadow()
      .find('#select')
      .select(1, { force: true });
    cy.get('[data-testid="compose-category-radio-button"]')
      .first()
      .click();
    cy.get('[data-testid="message-subject-field"]')
      .shadow()
      .find('#inputField')
      .type('testSubject', { force: true });
    cy.get('#compose-message-body')
      .shadow()
      .find('#textarea')
      .type('testMessage', { force: true });
  };

  verifySorting = () => {
    let listBefore;
    let listAfter;
    cy.get('.thread-list-item')
      .find('.received-date')
      .then(list => {
        listBefore = Cypress._.map(list, el => el.innerText);
        cy.log(`List before sorting${JSON.stringify(listBefore)}`);
      })
      .then(() => {
        this.sortMessagesByDate('Oldest to newest');
        cy.get('.thread-list-item')
          .find('.received-date')
          .then(list2 => {
            listAfter = Cypress._.map(list2, el => el.innerText);
            cy.log(`List after sorting${JSON.stringify(listAfter)}`);
            expect(listBefore[0]).to.eq(listAfter[listAfter.length - 1]);
            expect(listBefore[listBefore.length - 1]).to.eq(listAfter[0]);
          });
      });
  };

  verifySignature = () => {
    cy.get('[data-testid="message-body-field"]')
      .should('have.attr', 'value')
      .and('not.be.empty');
  };

  inputFilterData = text => {
    cy.get('#filter-input')
      .shadow()
      .find('#inputField')
      .type(`${text}`, { force: true });
  };

  filterMessages = () => {
    cy.intercept(
      'POST',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/0/search`,
      inboxSearchResponse,
    );
    cy.get(Locators.BUTTONS.FILTER).click({ force: true });
  };

  verifyFilterResults = (filterValue, responseData = inboxSearchResponse) => {
    cy.get('[data-testid="message-list-item"]').should(
      'have.length',
      `${responseData.data.length}`,
    );

    cy.get('[data-testid="highlighted-text"]').each(element => {
      cy.wrap(element)
        .invoke('text')
        .then(text => {
          const lowerCaseText = text.toLowerCase();
          expect(lowerCaseText).to.contain(`${filterValue}`);
        });
    });
  };

  clearFilter = () => {
    this.inputFilterData('any');
    this.filterMessages();
    cy.get('[text="Clear Filters"]').click({ force: true });
  };

  verifyFilterFieldCleared = () => {
    cy.get('#filter-input')
      .shadow()
      .find('#inputField')
      .should('be.empty');
  };

  sortMessagesByDate = (text, sortedResponse = mockSortedMessages) => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('#select')
      .select(`${text}`, { force: true });
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/threads**',
      sortedResponse,
    );
    cy.get('[data-testid="sort-button"]').click({ force: true });
  };

  getInboxHeader = text => {
    cy.get('[data-testid="folder-header"]').should('have.text', `${text}`);
  };

  verifyCernerFacilityNames(user, ehrData) {
    this.user = user;
    this.ehrData = ehrData;
    let cernerIndex = 0;
    let cernerCount = 0;
    for (
      let i = 0;
      i < user.data.attributes.vaProfile.facilities.length;
      i += 1
    ) {
      const facility = user.data.attributes.vaProfile.facilities[i];
      if (facility.isCerner) {
        cernerCount += 1;
      }
    }

    for (
      let i = 0;
      i < user.data.attributes.vaProfile.facilities.length;
      i += 1
    ) {
      cy.log(` i = ${i}`);
      const facility = user.data.attributes.vaProfile.facilities[i];
      let facilityName = '';

      if (facility.isCerner) {
        const facilityId = `vha_${facility.facilityId}`;
        cy.log(`id = ${facilityId}`);
        for (let j = 0; j < ehrData.data.nodeQuery.entities.length; j += 1) {
          if (
            ehrData.data.nodeQuery.entities[j].fieldFacilityLocatorApiId ===
            facilityId
          ) {
            facilityName =
              ehrData.data.nodeQuery.entities[j].fieldRegionPage.entity.title;
          }
        }
        cy.log(`name = ${facilityName}`);
        if (cernerCount === 0) {
          cy.get('[data-testid="cerner-facilities-alert"]').should(
            'not.be.visible',
          );
        } else if (cernerCount === 1) {
          cy.get('[data-testid="cerner-facilities-alert"]')
            .shadow()
            .get('[data-testid="single-cerner-facility-text"]')
            .contains(facilityName);
          break;
        } else if (cernerCount > 1) {
          cy.get('[data-testid="cerner-facilities-alert"]')
            .shadow()
            .get('[data-testid="cerner-facility"]')
            .eq(cernerIndex)
            .contains(facilityName);
        }
        cernerIndex += 1;
      }
    }
  }
}

export default PatientInboxPage;
