import mockDraftFolderMetaResponse from '../fixtures/folder-drafts-metadata.json';
import mockDraftResponse from '../fixtures/message-draft-response.json';
import { Data, Locators, Paths } from '../utils/constants';
import sentSearchResponse from '../fixtures/sentResponse/sent-search-response.json';
import mockSortedMessages from '../fixtures/draftsResponse/sorted-drafts-messages-response.json';
import { Alerts } from '../../../util/constants';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';
import mockMessages from '../fixtures/messages-response.json';
import FolderLoadPage from './FolderLoadPage';
import mockDraftsRespone from '../fixtures/draftPageResponses/draft-threads-response.json';
import mockReplyDraftResponse from '../fixtures/draftPageResponses/single-reply-draft-response.json';
import mockSavedDraftResponse from '../fixtures/draftPageResponses/single-draft-response.json';

class PatientMessageDraftsPage {
  loadDrafts = (messagesResponse = mockDraftsRespone) => {
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-2*`,
      mockDraftFolderMetaResponse,
    ).as('draftsFolderMetaResponse');

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/-2/threads**`,
      messagesResponse,
    ).as('draftsResponse');
    FolderLoadPage.loadFolders();
    cy.get('[data-testid="Drafts"]>a').click({ force: true });
  };

  loadSingleDraft = (
    mockThread = mockDraftsRespone,
    singleDraftThread = mockSavedDraftResponse,
  ) => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_EXTENDED}/${
        mockThread.data[0].attributes.messageId
      }/thread*`,
      singleDraftThread,
    ).as('full-thread');

    cy.contains(mockThread.data[0].attributes.subject).click();
  };

  loadSingleReplyDraft = (singleReplyDraftThread = mockReplyDraftResponse) => {
    cy.intercept(
      'GET',
      `${Paths.SM_API_EXTENDED}/${
        mockDraftsRespone.data[0].attributes.messageId
      }/thread*`,
      singleReplyDraftThread,
    ).as('full-thread');

    cy.contains(mockDraftsRespone.data[0].attributes.subject).click({
      waitForAnimations: true,
    });
    cy.get(`[subheader]`)
      .eq(0)
      .click();
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
    cy.get(`#delete-draft-button`).should('be.visible');
    cy.get(`#delete-draft-button`).click({
      force: true,
      waitForAnimations: true,
    });
  };

  clickMultipleDeleteButton = number => {
    cy.get(`[data-testid="reply-form"]`)
      .find('va-accordion-item')
      .then(el => {
        if (el.length > 1) {
          cy.get(`#delete-draft-button-${number}`).should('be.visible');
          cy.get(`#delete-draft-button-${number}`).click({
            force: true,
            waitForAnimations: true,
          });
        } else {
          cy.get(`#delete-draft-button`).should('be.visible');
          cy.get(`#delete-draft-button`).click({
            force: true,
            waitForAnimations: true,
          });
        }
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

  saveMultiDraftMessage = (mockResponse, messageId, btnNum) => {
    const firstNonDraftMessageId = mockMultiDraftsResponse.data.filter(
      el => el.attributes.draftDate === null,
    )[0].attributes.messageId;
    cy.intercept(
      'PUT',
      `${
        Paths.SM_API_BASE
      }/message_drafts/${firstNonDraftMessageId}/replydraft/${messageId}`,
      { ok: true },
    ).as('saveDraft');
    cy.get(`#save-draft-button-${btnNum}`).click();
    cy.wait('@saveDraft');
  };

  confirmDeleteDraft = draftMessage => {
    cy.intercept(
      'DELETE',
      `${Paths.INTERCEPT.MESSAGES}/${
        draftMessage.data[0].attributes.messageId
      }`,
      draftMessage,
    ).as('deletedDraftResponse');

    cy.get(Locators.BUTTONS.DELETE_CONFIRM).click({ force: true });
  };

  deleteMultipleDraft = (mockResponse, reducedMockResponse, index = 0) => {
    cy.intercept(
      'DELETE',
      `${Paths.INTERCEPT.MESSAGES}/${
        mockResponse.data[index].attributes.messageId
      }`,
      mockResponse.data[index],
    ).as('deletedDraftResponse');

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${
        mockResponse.data[2].attributes.messageId
      }/thread?*`,
      reducedMockResponse,
    ).as('updatedThreadResponse');

    cy.get(Locators.BUTTONS.DELETE_CONFIRM).click({ force: true });
  };

  verifyDeleteConfirmationMessage = () => {
    cy.get('[data-testid="alert-text"]').should(
      'contain.text',
      Alerts.Message.DELETE_DRAFT_SUCCESS,
    );
  };

  verifyConfirmationMessage = message => {
    cy.get('[data-testid="alert-text"]').should('contain.text', message);
  };

  verifyDeleteConfirmationButton = () => {
    cy.get(Locators.ALERTS.NOTIFICATION).should('be.visible');
  };

  confirmDeleteDraftWithEnterKey = (draftMessage = mockSavedDraftResponse) => {
    cy.intercept(
      'DELETE',
      `${Paths.INTERCEPT.MESSAGES}/${
        draftMessage.data[0].attributes.messageId
      }`,
      draftMessage,
    ).as('deletedDraftResponse');
    cy.tabToElement('va-button[text="Delete draft"]').realPress(['Enter']);
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

  selectCategory = (category = 'COVID') => {
    cy.get(Locators.BUTTONS.CATEG_RADIO_BUTT)
      .contains(category)
      .click();
  };

  saveNewDraftMessage = (singleThreadData, singleMessageData) => {
    cy.intercept(
      'POST',
      `${Paths.SM_API_BASE}/message_drafts/${
        singleThreadData.data[0].id
      }/replydraft`,
      singleMessageData,
    ).as('replyThread');

    cy.get(Locators.BUTTONS.SAVE_DRAFT).click({ force: true });
  };

  saveExistingDraft = (
    category,
    subject,
    requestData = mockSavedDraftResponse,
  ) => {
    cy.intercept(
      'PUT',
      `/my_health/v1/messaging/message_drafts/${
        requestData.data[0].attributes.messageId
      }`,
      {},
    ).as('draft_message');
    cy.get(Locators.BUTTONS.SAVE_DRAFT).click();

    cy.get('@draft_message')
      .its('request.body')
      .then(message => {
        expect(message.category).to.eq(category);
        expect(message.subject).to.eq(subject);
      });
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

  inputFilterDataText = text => {
    cy.get(Locators.FILTER_INPUT)
      .shadow()
      .find('#inputField')
      .type(`${text}`, { force: true });
  };

  submitFilterByKeyboard = (mockFilterResponse, folderId) => {
    cy.intercept(
      'POST',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/${folderId}/search`,
      mockFilterResponse,
    ).as('filterResult');

    cy.realPress('Enter');
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

  verifyFilterResults = (filterValue, responseData = sentSearchResponse) => {
    cy.get(Locators.MESSAGES).should(
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

  clearFilterByKeyboard = () => {
    // next line required to start tab navigation from the header of the page
    cy.get('[data-testid="folder-header"]').click();
    cy.contains('Clear Filters').then(el => {
      cy.tabToElement(el)
        .first()
        .click();
    });
  };

  verifyFilterFieldCleared = () => {
    cy.get(Locators.FILTER_INPUT)
      .shadow()
      .find('#inputField')
      .should('be.empty');
  };

  sortMessagesByKeyboard = (text, data, folderId) => {
    cy.get(Locators.DROPDOWN.SORT)
      .shadow()
      .find('select')
      .select(`${text}`, { force: true });

    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGE_FOLDERS}/${folderId}/threads**`,
      data,
    ).as('sortResponse');
    cy.tabToElement('[data-testid="sort-button"]');
    cy.realPress('Enter');
  };

  verifySortingByKeyboard = (text, data, folderId) => {
    let listBefore;
    let listAfter;
    cy.get(Locators.THREAD_LIST)
      .find(Locators.DATE_RECEIVED)
      .then(list => {
        listBefore = Cypress._.map(list, el => el.innerText);
        cy.log(`List before sorting${JSON.stringify(listBefore)}`);
      })
      .then(() => {
        this.sortMessagesByKeyboard(`${text}`, data, folderId);
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
    cy.get(Locators.DROPDOWN.SORT)
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

  inputFilterDataByKeyboard = text => {
    cy.tabToElement('#inputField')
      .first()
      .type(`${text}`, { force: true });
  };

  verifyDraftMessageBannerTextHasFocus = () => {
    cy.focused().should('contain.text', 'Draft was successfully deleted.');
  };

  verifySavedMessageAlertText = (text = Data.MESSAGE_WAS_SAVED) => {
    cy.get(Locators.ALERTS.SAVE_DRAFT).should('include.text', text);
  };

  expandAllDrafts = () => {
    cy.get(Locators.BUTTONS.EDIT_DRAFTS).click({
      force: true,
      waitForAnimations: true,
    });
  };

  verifyExpandedDraftBody = (response, number, index) => {
    cy.get('[open="true"]')
      .find('.thread-list-draft')
      .should('contain.text', `Draft ${number}`);

    cy.get(`[open="true"]`)
      .find(`[data-testid="draft-reply-to"]`)
      .should('contain.text', response.data[index].attributes.recipientName);
  };

  expandSingleDraft = number => {
    cy.get(`[subheader="draft #${number}..."]`)
      .shadow()
      .find('button')
      .click({ force: true, waitForAnimations: true });
  };

  verifyExpandedDraftButtons = number => {
    cy.get(`[open="true"]`)
      .find(`#attach-file-button-${number}`)
      .shadow()
      .find(`button`)
      .should('be.visible')
      .and(`have.text`, `Attach file to draft ${number}`);

    cy.get(`[open="true"]`)
      .find(`#send-button-${number}`)
      .shadow()
      .find(`button`)
      .should('be.visible')
      .and(`have.text`, `Send draft ${number}`);

    cy.get(`[open="true"]`)
      .find(`#save-draft-button-${number}`)
      .should('be.visible')
      .and(`have.text`, `Save draft ${number}`);

    cy.get(`[open="true"]`)
      .find(`#delete-draft-button-${number}`)
      .should('be.visible')
      .and(`have.text`, `Delete draft ${number}`);
  };

  verifyExpandedOldDraftButtons = number => {
    cy.get(`#delete-draft-button-${number}`)
      .should('be.visible')
      .and('have.text', `Delete draft ${number}`);

    cy.get('[class^="attachments-section]').should('not.exist');
    cy.get(`#send-button-${number}`).should('not.exist');
    cy.get(`#save-draft-button-${number}`).should('not.exist');
  };

  verifySaveWithAttachmentAlert = () => {
    cy.get(Locators.ALERTS.ALERT_MODAL)
      .shadow()
      .find('h2')
      .should('contain', `can't save attachment`);
  };

  closeModal = () => {
    cy.get('va-modal[visible]')
      .find('.va-modal-close')
      .click();
  };

  verifyThreadRecipientName = (mockResponse, index) => {
    cy.get(Locators.THREADS)
      .find(`.vads-u-font-weight--bold`)
      .eq(index)
      .should(`be.visible`)
      .and(`have.text`, mockResponse.data[index].attributes.recipientName);
  };

  verifyAttachFileBtn = () => {
    cy.get(Locators.BUTTONS.ATTACH_FILE)
      .shadow()
      .find(`button`)
      .should(`be.visible`)
      .and(`have.text`, Data.BUTTONS.ATTACH_FILE);
  };

  verifySendDraftBtn = () => {
    cy.get(Locators.BUTTONS.SEND)
      .shadow()
      .find(`button`)
      .should(`be.visible`)
      .and(`contain.text`, Data.BUTTONS.SEND);
  };

  verifySaveDraftBtn = () => {
    cy.get(Locators.BUTTONS.SAVE_DRAFT)
      .should(`be.visible`)
      .and('contain.text', Data.BUTTONS.SAVE_DRAFT);
  };

  verifyDeleteDraftBtn = () => {
    cy.get(Locators.BUTTONS.DELETE_DRAFT)
      .should(`be.visible`)
      .and(`contain.text`, Data.BUTTONS.DELETE_DRAFT);
  };

  verifyCantSaveAlert = (
    alertText,
    firstBtnText = `Edit draft`,
    secondBtnText = `Delete draft`,
  ) => {
    cy.get(`[status="warning"]`)
      .find(`h2`)
      .should('be.visible')
      .and(`contain.text`, alertText);

    cy.get(`[status="warning"]`)
      .find(`[text='${firstBtnText}']`)
      .shadow()
      .find(`button`)
      .should('be.visible')
      .and(`contain.text`, firstBtnText);

    cy.get(`[status="warning"]`)
      .find(`[text='${secondBtnText}']`)
      .shadow()
      .find(`.last-focusable-child`)
      .should('be.visible')
      .and(`contain.text`, secondBtnText);
  };

  clickDeleteChangesButton = () => {
    cy.get(`[status="warning"]`)
      .find(`va-button[text="Delete changes"]`)
      .click();
  };
}

export default new PatientMessageDraftsPage();
