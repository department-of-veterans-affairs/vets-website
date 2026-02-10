import mockDraftFolderMetaResponse from '../fixtures/folder-drafts-metadata.json';
import mockDraftResponse from '../fixtures/message-draft-response.json';
import { Data, Locators, Paths } from '../utils/constants';
import { Alerts } from '../../../util/constants';
import mockMultiDraftsResponse from '../fixtures/draftsResponse/multi-draft-response.json';
import mockMessages from '../fixtures/threads-response.json';
import FolderLoadPage from './FolderLoadPage';
import mockDraftsResponse from '../fixtures/draftPageResponses/draft-threads-response.json';
import mockReplyDraftResponse from '../fixtures/draftPageResponses/single-reply-draft-response.json';
import mockSavedDraftResponse from '../fixtures/draftPageResponses/single-draft-response.json';

class PatientMessageDraftsPage {
  loadDrafts = (messagesResponse = mockDraftsResponse) => {
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
    mockThread = mockDraftsResponse,
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
        mockDraftsResponse.data[0].attributes.messageId
      }/thread*`,
      singleReplyDraftThread,
    ).as('full-thread');

    cy.contains(mockDraftsResponse.data[0].attributes.subject).click({
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
      force: true,
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

  confirmDeleteDraft = draftMessage => {
    cy.intercept(
      'DELETE',
      `${Paths.INTERCEPT.MESSAGES}/${
        draftMessage.data[0].attributes.messageId
      }`,
      draftMessage,
    ).as('deletedDraftResponse');

    cy.get(Locators.BUTTONS.DELETE_CONFIRM)
      .shadow()
      .find(`button`)
      .click({ force: true });
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
    cy.get(`#save-draft-button-${btnNum}`).click({ force: true });
    cy.wait('@saveDraft');
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

  verifyDraftDeletedAlertAndH1Focus = () => {
    cy.get('h1').should('have.focus');
    cy.findByTestId('alert-text').should(
      'contain.text',
      'Draft was successfully deleted.',
    );
  };

  verifySavedMessageAlertText = (text = Data.MESSAGE_WAS_SAVED) => {
    cy.get(Locators.ALERTS.SAVE_DRAFT).should('include.text', text);
  };

  // Note: expandAllDrafts removed - drafts now auto-expand by default

  verifyExpandedDraftBody = (response, number, index) => {
    cy.get(Locators.ACCORDION_ITEM_OPEN)
      .find('.thread-list-draft')
      .should('contain.text', `Draft ${number}`);

    cy.get(Locators.ACCORDION_ITEM_OPEN)
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
    cy.get(Locators.ACCORDION_ITEM_OPEN)
      .find(`#attach-file-button-${number}`)
      .shadow()
      .find(`button`)
      .should('be.visible')
      .and(`have.text`, `Attach file to draft ${number}`);

    cy.get(Locators.ACCORDION_ITEM_OPEN)
      .find(`#send-button-${number}`)
      .shadow()
      .find(`button`)
      .should('be.visible')
      .and(`have.text`, `Send draft ${number}`);

    cy.get(Locators.ACCORDION_ITEM_OPEN)
      .find(`#save-draft-button-${number}`)
      .should('be.visible')
      .and(`have.text`, `Save draft ${number}`);

    cy.get(Locators.ACCORDION_ITEM_OPEN)
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
    cy.findByTestId(Locators.BUTTONS.ATTACH_FILE)
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
    cy.get(`va-modal[status="warning"]`)
      .find(`h2`)
      .should('be.visible')
      .and(`contain.text`, alertText);

    cy.get(`va-modal[status="warning"]`)
      .find(`va-button[text='${firstBtnText}']`)
      .should('be.visible');

    cy.get(`va-modal[status="warning"]`)
      .find(`va-button[text='${secondBtnText}']`)
      .should('be.visible');
  };

  clickDeleteChangesButton = () => {
    cy.get(`[status="warning"]`)
      .find(`va-button[text="Delete changes"]`)
      .click();
  };

  verifyDraftToFieldContainsPlainTGName = value => {
    cy.get('[data-testid="message-list-item"]').should('contain.text', value);
  };
}

export default new PatientMessageDraftsPage();
