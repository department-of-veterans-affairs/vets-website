import mockDraftFolderMetaResponse from '../fixtures/folder-drafts-metadata.json';
import mockDraftMessagesResponse from '../fixtures/drafts-response.json';
import mockDraftResponse from '../fixtures/message-draft-response.json';
import defaultMockThread from '../fixtures/single-draft-response.json';
import { AXE_CONTEXT, Locators, Paths } from '../utils/constants';
import sentSearchResponse from '../fixtures/sentResponse/sent-search-response.json';
import mockSortedMessages from '../fixtures/draftsResponse/sorted-drafts-messages-response.json';
import { Alerts } from '../../../../util/constants';
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
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-2*`,
      mockDraftFolderMetaResponse,
    ).as('draftsFolderMetaResponse');
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-2/threads**`,
      this.mockDraftMessages,
    ).as('draftsResponse');
    cy.get(Locators.FOLDERS.DRAFTS).click();
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
      `${Paths.INTERCEPT.MESSAGES}/${
        this.currentThread.data.at(0).attributes.messageId
      }`,
      mockParentMessageDetails,
    ).as('message1');

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${
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
      }/thread*`,
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
      `${Paths.INTERCEPT.MESSAGES}/${
        mockResponse.data[0].attributes.messageId
      }`,
      { data: mockResponse.data[0] },
    ).as('firstDraft');
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${
        mockResponse.data[1].attributes.messageId
      }`,
      { data: mockResponse.data[1] },
    ).as('secondDraft');

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${
        mockResponse.data[2].attributes.messageId
      }`,
      { data: mockResponse.data[2] },
    ).as('firstSentMessage');

    cy.contains(mockMessages.data[0].attributes.subject).click({
      waitForAnimations: true,
    });
  };

  clickDeleteButton = () => {
    cy.get(Locators.BUTTONS.DELETE_DRAFT).should('be.visible');
    cy.get(Locators.BUTTONS.DELETE_DRAFT).click({
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
      `${Paths.INTERCEPT.MESSAGES}/${draftMessage.data.attributes.messageId}`,
      draftMessage,
    ).as('deletedDraftResponse');
    if (isNewDraftText) {
      cy.get(Locators.ALERTS.DRAFT_MODAL)
        .find('va-button[text="Delete draft"]', { force: true })
        .contains('Delete draft')
        .click({ force: true });
      // Wait needs to be added back in before closing PR
      // cy.wait('@deletedDraftResponse', { requestTimeout: 10000 });
    } else {
      cy.get(Locators.ALERTS.DRAFT_MODAL)
        .find('va-button[text="Delete draft"]', { force: true })
        .contains('Delete draft')
        .click({ force: true });
      cy.wait('@deletedDraftResponse', { requestTimeout: 10000 });
    }
  };

  deleteDraftMessage = (mockResponse, messageId) => {
    cy.intercept('DELETE', `${Paths.INTERCEPT.MESSAGES}/${messageId}`, {
      data: mockResponse,
    }).as('deletedDraftResponse');

    cy.get(Locators.BUTTONS.DELETE_DRAFT).click({ waitForAnimations: true });
    cy.get('[text="Delete draft"]').click({ waitForAnimations: true });
  };

  // method below could be deleted after refactoring associated specs
  verifyDeleteConfirmationMessage = () => {
    cy.get('[data-testid="alert-text"]').should(
      'contain.text',
      Alerts.Message.DELETE_DRAFT_SUCCESS,
    );
  };

  verifyConfirmationMessage = message => {
    cy.get('[data-testid="alert-text"]').should('contain.text', message);
  };

  verifyDeleteConfirmationHasFocus = () => {
    cy.get(Locators.ALERTS.NOTIFICATION).should('have.focus');
  };

  confirmDeleteDraftWithEnterKey = draftMessage => {
    cy.intercept(
      'DELETE',
      `${Paths.INTERCEPT.MESSAGES}/${draftMessage.data.attributes.messageId}`,
      draftMessage,
    ).as('deletedDraftResponse');
    cy.tabToElement('va-button[text="Delete draft"]').realPress(['Enter']);
    // cy.wait('@deletedDraftResponse');
  };

  confirmDeleteReplyDraftWithEnterKey = draftMessage => {
    cy.log(`delete message id = ${draftMessage.data.attributes.messageId}`);

    cy.intercept(
      'DELETE',
      `${Paths.INTERCEPT.MESSAGES}/${draftMessage.data.attributes.messageId}`,
      { statuscode: 204 },
    ).as('deletedDraftResponse');

    cy.get(Locators.ALERTS.DRAFT_MODAL);
    cy.realPress(['Tab']);
    cy.realPress(['Enter']);
    cy.wait('@deletedDraftResponse', { requestTimeout: 10000 })
      .its('request.url')
      .should('include', `${draftMessage.data.attributes.messageId}`);
  };

  getMessageSubjectField = () => {
    return cy
      .get(Locators.MESSAGE_SUBJECT)
      .shadow()
      .find('[name="message-subject"]');
  };

  getMessageBodyField = () => {
    return cy
      .get(Locators.MESSAGES_BODY)
      .shadow()
      .find('[name="compose-message-body"]');
  };

  openAdvancedSearch = () => {
    cy.get(Locators.ADDITIONAL_FILTER).click();
  };

  selectAdvancedSearchCategory = () => {
    cy.get(Locators.FIELDS.CATEGORY_DROPDOWN)
      .find('select')
      .select('COVID');
  };

  clickSubmitSearchButton = () => {
    cy.get(Locators.BUTTONS.FILTER).click();
  };

  selectRecipientName = recipientName => {
    cy.get(Locators.ALERTS.RECIP_SELECT)
      .shadow()
      .find('select')
      .select(recipientName);
  };

  selectCategory = (category = 'COVID') => {
    cy.get(Locators.BUTTONS.CATEG_RADIO_BUTT)
      .contains(category)
      .click();
  };

  addMessageSubject = subject => {
    cy.get(Locators.MESSAGE_SUBJECT)
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
    cy.intercept('POST', Paths.INTERCEPT.MESSAGE_DRAFTS, mockDraftResponse).as(
      'draft_message',
    );
    cy.tabToElement('#save-draft-button');
    cy.realPress('Enter');
    cy.wait('@draft_message').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
  };

  verifyFocusOnConfirmationMessage = () => {
    cy.get('.last-save-time').should('have.focus');
  };

  inputFilterDataText = text => {
    cy.get(Locators.FILTER_INPUT)
      .shadow()
      .find('#inputField')
      .type(`${text}`, { force: true });
  };

  clickFilterMessagesButton = () => {
    cy.intercept(
      'POST',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-2/search`,
      sentSearchResponse,
    );
    cy.get(Locators.BUTTONS.FILTER).click({ force: true });
  };

  clickClearFilterButton = () => {
    this.inputFilterDataText('any');
    this.clickFilterMessagesButton();
    cy.get(Locators.CLEAR_FILTERS).click({ force: true });
  };

  verifyFilterResultsText = (
    filterValue,
    responseData = sentSearchResponse,
  ) => {
    cy.get(Locators.MESS_LIST).should(
      'have.length',
      `${responseData.data.length}`,
    );
    cy.get(Locators.ALERTS.HIGHLIGHTED).each(element => {
      cy.wrap(element)
        .invoke('text')
        .then(text => {
          const lowerCaseText = text.toLowerCase();
          expect(lowerCaseText).to.contain(`${filterValue}`);
        });
    });
  };

  clickSortMessagesByDateButton = (
    text,
    sortedResponse = mockSortedMessages,
  ) => {
    cy.get(Locators.DROPDOWN)
      .shadow()
      .find('select')
      .select(`${text}`, { force: true });
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-2/threads**`,
      sortedResponse,
    );
    cy.get(Locators.BUTTONS.SORT).click({ force: true });
  };

  verifyFilterFieldCleared = () => {
    cy.get(Locators.FILTER_INPUT)
      .shadow()
      .find('#inputField')
      .should('be.empty');
  };

  verifySorting = () => {
    let listBefore;
    let listAfter;
    cy.get(Locators.THREAD_LIST)
      .find(Locators.DATE_RECEIVED)
      .then(list => {
        listBefore = Cypress._.map(list, el => el.innerText);
        cy.log(`List before sorting${JSON.stringify(listBefore)}`);
      })
      .then(() => {
        this.clickSortMessagesByDateButton('Oldest to newest');
        cy.get(Locators.THREAD_LIST)
          .find(Locators.DATE_RECEIVED)
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
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-2*`,
      mockDraftFolderMetaResponse,
    ).as('draftFolder');
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-2/threads**`,
      mockMessagesResponse,
    ).as('draftFolderMessages');
    cy.get(Locators.FOLDERS.DRAFTS).click();
    cy.wait('@draftFolder');
    cy.wait('@draftFolderMessages');
  };

  verifyDraftMessageBannerTextHasFocus = () => {
    cy.focused().should('contain.text', 'Draft was successfully deleted.');
  };

  verifyMessagesBodyText = MessageBody => {
    cy.get(Locators.MESSAGES_BODY)
      .should('have.attr', 'value')
      .and('eq', MessageBody);
  };

  verifyDraftMessageBodyText = MessagesBodyDraft => {
    cy.get(Locators.MESSAGES_BODY_DRAFT).should(
      'have.text',
      `${MessagesBodyDraft}`,
    );
  };

  verifySavedMessageAlertText = MESSAGE_WAS_SAVED => {
    cy.get(Locators.ALERTS.SAVE_DRAFT).should(
      'include.text',
      MESSAGE_WAS_SAVED,
    );
  };
}

export default PatientMessageDraftsPage;
