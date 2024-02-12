import mockDraftFolderMetaResponse from '../fixtures/folder-drafts-metadata.json';
import mockDraftMessagesResponse from '../fixtures/drafts-response.json';
import mockDraftResponse from '../fixtures/message-draft-response.json';
import defaultMockThread from '../fixtures/single-draft-response.json';
import { AXE_CONTEXT, Locators, Paths } from '../utils/constants';
import sentSearchResponse from '../fixtures/sentResponse/sent-search-response.json';
import mockSortedMessages from '../fixtures/draftsResponse/sorted-drafts-messages-response.json';
import { Alerts } from '../../../util/constants';
import mockDraftMessages from '../fixtures/draftsResponse/drafts-messages-response.json';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';
import mockMessages from '../fixtures/messages-response.json';

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
      '/my_health/v1/messaging/folders/-2*',
      mockDraftFolderMetaResponse,
    ).as('draftsFolderMetaResponse');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2/threads**',
      this.mockDraftMessages,
    ).as('draftsResponse');
    cy.get('[data-testid="drafts-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
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
      }/thread?full_body=true`,
      this.currentThread,
    ).as('full-thread');

    cy.contains(mockParentMessageDetails.data.attributes.subject).click({
      waitForAnimations: true,
    });
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    // cy.wait('@message1');
    cy.wait('@full-thread');
  };

  loadSingleDraft = (singleDraftThread, singleDraft) => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_EXTENDED}/${
        mockMessages.data[0].attributes.messageId
      }/thread`,
      singleDraftThread,
    ).as('full-thread');

    cy.intercept(
      'GET',
      `${Paths.SM_API_EXTENDED}/${
        singleDraftThread.data[0].attributes.messageId
      }`,
      singleDraft,
    ).as('fist-message-in-thread');

    cy.contains(mockMessages.data[0].attributes.subject).click({
      waitForAnimations: true,
    });
  };

  loadMultiDraftThread = (mockResponse = mockMultiDraftsResponse) => {
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/messages/2666253/thread?full_body=true',
      mockResponse,
    ).as('multiDraft');

    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockResponse.data[0].attributes.messageId
      }`,
      { data: mockResponse.data[0] },
    ).as('firstDraft');
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockResponse.data[1].attributes.messageId
      }`,
      { data: mockResponse.data[1] },
    ).as('secondDraft');

    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
        mockResponse.data[2].attributes.messageId
      }`,
      { data: mockResponse.data[2] },
    ).as('firstSentMessage');

    cy.contains(mockMessages.data[0].attributes.subject).click({
      waitForAnimations: true,
    });
  };

  clickDeleteButton = () => {
    cy.get('[data-testid="delete-draft-button"]').should('be.visible');
    cy.get('[data-testid="delete-draft-button"]').click({
      force: true,
      waitForAnimations: true,
    });
  };

  sendDraftMessage = draftMessage => {
    cy.intercept('POST', `${Paths.SM_API_BASE}/messages`, draftMessage).as(
      'sentDraftResponse',
    );
    cy.get(Locators.BUTTONS.SEND).click({ force: true });
    cy.wait('@sentDraftResponse');
  };

  sendMultiDraftMessage = (mockResponse, messageId) => {
    cy.intercept('POST', `${Paths.SM_API_BASE}/messages/${messageId}/reply`, {
      data: mockResponse,
    }).as('sentDraftResponse');
    cy.get(Locators.BUTTONS.SEND).click({ force: true });
    cy.wait('@sentDraftResponse');
  };

  saveMultiDraftMessage = (mockResponse, messageId) => {
    const firstNonDraftMessageId = mockMultiDraftsResponse.data.filter(
      el => el.attributes.draftDate === null,
    )[0].attributes.messageId;
    cy.intercept(
      'PUT',
      `${
        Paths.SM_API_BASE
      }/message_drafts/${firstNonDraftMessageId}/replydraft/${messageId}`,
      { data: mockResponse },
    ).as('saveDraft');
    cy.get(Locators.BUTTONS.SAVE_DRAFT).click();
    cy.wait('@saveDraft');
  };

  confirmDeleteDraft = (draftMessage, isNewDraftText = false) => {
    cy.intercept(
      'DELETE',
      `/my_health/v1/messaging/messages/${
        draftMessage.data.attributes.messageId
      }`,
      draftMessage,
    ).as('deletedDraftResponse');
    if (isNewDraftText) {
      cy.get('[data-testid="delete-draft-modal"]')
        .find('va-button[text="Yes, delete this draft"]', { force: true })
        .contains('Yes, delete this draft')
        .click({ force: true });
      // Wait needs to be added back in before closing PR
      // cy.wait('@deletedDraftResponse', { requestTimeout: 10000 });
    } else {
      cy.get('[data-testid="delete-draft-modal"]')
        .find('va-button[text="Delete draft"]', { force: true })
        .contains('Delete draft')
        .click({ force: true });
      cy.wait('@deletedDraftResponse', { requestTimeout: 10000 });
    }
  };

  deleteDraftMessage = (mockResponse, messageId) => {
    cy.intercept('DELETE', `/my_health/v1/messaging/messages/${messageId}`, {
      data: mockResponse,
    }).as('deletedDraftResponse');

    cy.get(Locators.BUTTONS.DELETE_DRAFT).click({ waitForAnimations: true });
    cy.get('[text="Delete draft"]').click({ waitForAnimations: true });
  };

  // method below could be deleted after refactoring associated specs
  verifyDeleteConfirmationMessage = () => {
    cy.get('[close-btn-aria-label="Close notification"]').should(
      'have.text',
      Alerts.Message.DELETE_DRAFT_SUCCESS,
    );
  };

  verifyConfirmationMessage = message => {
    cy.get('[close-btn-aria-label="Close notification"]>div>p').should(
      'have.text',
      message,
    );
  };

  verifyDeleteConfirmationHasFocus = () => {
    cy.get('[close-btn-aria-label="Close notification"]').should('have.focus');
  };

  confirmDeleteDraftWithEnterKey = draftMessage => {
    cy.intercept(
      'DELETE',
      `/my_health/v1/messaging/messages/${
        draftMessage.data.attributes.messageId
      }`,
      draftMessage,
    ).as('deletedDraftResponse');
    cy.tabToElement('va-button[text="Delete draft"]').realPress(['Enter']);
    cy.wait('@deletedDraftResponse');
  };

  confirmDeleteReplyDraftWithEnterKey = draftMessage => {
    cy.log(`delete message id = ${draftMessage.data.attributes.messageId}`);

    cy.intercept(
      'DELETE',
      `/my_health/v1/messaging/messages/${
        draftMessage.data.attributes.messageId
      }`,
      { statuscode: 204 },
    ).as('deletedDraftResponse');

    cy.get('[data-testid="delete-draft-modal"]');
    cy.realPress(['Tab']);
    cy.realPress(['Enter']);
    cy.wait('@deletedDraftResponse', { requestTimeout: 10000 })
      .its('request.url')
      .should('include', `${draftMessage.data.attributes.messageId}`);
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

  openAdvancedSearch = () => {
    cy.get('#additional-filter-accordion').click();
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

  selectCategory = (category = 'COVID') => {
    cy.get('[data-testid="compose-category-radio-button"]')
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

  saveDraftMessage = mockResponse => {
    cy.intercept(
      'PUT',
      `/my_health/v1/messaging/message_drafts/3163320/replydraft/3163906`,
      { data: mockResponse },
    ).as('saveDraft');
    cy.get(Locators.BUTTONS.SAVE_DRAFT).click({ waitForAnimations: true });
    // cy.wait('@saveDraft');
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

  inputFilterData = text => {
    cy.get('#filter-input')
      .shadow()
      .find('#inputField')
      .type(`${text}`, { force: true });
  };

  filterMessages = () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/-2/search',
      sentSearchResponse,
    );
    cy.get('[data-testid="filter-messages-button"]').click({ force: true });
  };

  clearFilter = () => {
    this.inputFilterData('any');
    this.filterMessages();
    cy.get('[text="Clear Filters"]').click({ force: true });
  };

  verifyFilterResults = (filterValue, responseData = sentSearchResponse) => {
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

  sortMessagesByDate = (text, sortedResponse = mockSortedMessages) => {
    cy.get('#sort-order-dropdown')
      .shadow()
      .find('#select')
      .select(`${text}`, { force: true });
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2/threads**',
      sortedResponse,
    );
    cy.get('[data-testid="sort-button"]').click({ force: true });
  };

  verifyFilterFieldCleared = () => {
    cy.get('#filter-input')
      .shadow()
      .find('#inputField')
      .should('be.empty');
  };

  verifySorting = () => {
    let listBefore;
    let listAfter;
    cy.get('.thread-list-item')
      .find('[data-testid="received-date"]')
      .then(list => {
        listBefore = Cypress._.map(list, el => el.innerText);
        cy.log(`List before sorting${JSON.stringify(listBefore)}`);
      })
      .then(() => {
        this.sortMessagesByDate('Oldest to newest');
        cy.get('.thread-list-item')
          .find('[data-testid="received-date"]')
          .then(list2 => {
            listAfter = Cypress._.map(list2, el => el.innerText);
            cy.log(`List after sorting${JSON.stringify(listAfter)}`);
            expect(listBefore[0]).to.eq(listAfter[listAfter.length - 1]);
            expect(listBefore[listBefore.length - 1]).to.eq(listAfter[0]);
          });
      });
  };

  loadMessages = (mockMessagesResponse = mockDraftMessages) => {
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2*',
      mockDraftFolderMetaResponse,
    ).as('draftFolder');
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-2/threads**',
      mockMessagesResponse,
    ).as('draftFolderMessages');
    cy.get('[data-testid="drafts-sidebar"]').click();
    cy.wait('@draftFolder');
    cy.wait('@draftFolderMessages');
  };

  verifyDraftMessageBannerTextHasFocus = () => {
    cy.focused().should('contain.text', 'Draft was successfully deleted.');
  };
}

export default PatientMessageDraftsPage;
