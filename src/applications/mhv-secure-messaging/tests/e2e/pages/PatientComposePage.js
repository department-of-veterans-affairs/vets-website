import mockDraftMessage from '../fixtures/message-draft-response.json';
import mockMessageResponse from '../fixtures/message-response.json';
import mockThreadResponse from '../fixtures/thread-response.json';
import mockSignature from '../fixtures/signature-response.json';
import { Locators, Paths, Data } from '../utils/constants';
import mockDraftResponse from '../fixtures/message-compose-draft-response.json';
import mockRecipients from '../fixtures/recipients-response.json';

class PatientComposePage {
  messageSubjectText = 'testSubject';

  messageBodyText = 'testBody';

  sendMessage = mockRequest => {
    cy.intercept('POST', Paths.INTERCEPT.MESSAGES, mockDraftMessage).as(
      'message',
    );
    cy.get(Locators.BUTTONS.SEND)
      .contains('Send')
      .click({ force: true });
    cy.wait(Locators.INFO.MESSAGE)
      .its('request.body')
      .then(request => {
        if (mockRequest) {
          expect(request.body).to.eq(
            `\n\n\nName\nTitleTest${mockRequest.body}`,
          );
          expect(request.category).to.eq(mockRequest.category);
          expect(request.recipient_id).to.eq(mockRequest.recipientId);
          expect(request.subject).to.eq(mockRequest.subject);
        }
      });
  };

  pushSendMessageWithKeyboardPress = () => {
    cy.intercept('POST', Paths.SM_API_EXTENDED, mockDraftMessage).as('message');
    cy.get(Locators.MESSAGES_BODY).click();
    cy.tabToElement(Locators.BUTTONS.SEND);
    cy.realPress(['Enter']);
    // cy.wait(Locators.INFO.MESSAGE);
  };

  clickSendMessageButton = () => {
    cy.get(Locators.BUTTONS.SEND).click({
      waitForAnimations: true,
      force: true,
    });
  };

  clickSaveDraftButton = () => {
    cy.get(Locators.BUTTONS.SAVE_DRAFT).click({
      waitForAnimations: true,
      force: true,
    });
  };

  verifySendMessageConfirmationMessageText = () => {
    cy.get('[data-testid="alert-text"]').should(
      'contain.text',
      Data.SECURE_MSG_SENT_SUCCESSFULLY,
    );
  };

  verifySendMessageConfirmationMessageHasFocus = () => {
    cy.focused().should('contain.text', Data.SECURE_MSG_SENT_SUCCESSFULLY);
  };

  selectRecipient = (recipient = 1) => {
    cy.get(Locators.ALERTS.REPT_SELECT).click();
    cy.get(Locators.ALERTS.REPT_SELECT)
      .shadow()
      .find('select')
      .select(recipient, { force: true });
  };

  selectCategory = (category = 'OTHER') => {
    cy.get(`#compose-message-categories${category}input`).click({
      force: true,
    });
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

  enterDataToMessageSubject = (text = this.messageSubjectText) => {
    cy.get(Locators.MESSAGE_SUBJECT)
      .shadow()
      .find('[name="message-subject"]')
      .type(text, { force: true });
  };

  enterDataToMessageBody = (text = this.messageBodyText) => {
    cy.get(Locators.MESSAGES_BODY)
      .shadow()
      .find('[name="compose-message-body"]')
      .type(text, { force: true });
  };

  verifyFocusOnMessageAttachment = () => {
    cy.get(Locators.ALERTS.SUCCESS_ALERT)
      .should('be.visible')
      .should('have.focus');
  };

  verifyFocusOnErrorMessage = text => {
    return cy.focused().should('have.attr', 'error', text);
  };

  //* Refactor* Needs to have mockDraftMessage as parameter
  clickOnSendMessageButton = () => {
    cy.intercept('POST', Paths.INTERCEPT.MESSAGES, mockDraftMessage).as(
      'message',
    );
    cy.get(Locators.BUTTONS.SEND)
      .contains('Send')
      .click();
  };

  //* Refactor*  make parameterize mockDraftMessage
  sendDraft = draftMessage => {
    cy.intercept('POST', Paths.INTERCEPT.MESSAGES, draftMessage).as(
      'draft_message',
    );
    cy.get(Locators.BUTTONS.SEND).click();
    cy.wait('@draft_message').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
    cy.get(Locators.ALERTS.DRAFT_MESSAGE)
      .its('request.body')
      .then(message => {
        expect(message.category).to.eq(draftMessage.data.attributes.category);
        expect(message.subject).to.eq(draftMessage.data.attributes.subject);
        expect(message.body).to.eq(draftMessage.data.attributes.body);
      });
  };

  keyboardNavToMessageBodyField = () => {
    return cy
      .get(Locators.MESSAGES_BODY)
      .shadow()
      .find('textarea');
  };

  keyboardNavToMessageSubjectField = () => {
    return cy
      .tabToElement(Locators.MESSAGE_SUBJECT)
      .shadow()
      .find('#inputField');
  };

  composeDraftByKeyboard = () => {
    cy.tabToElement('#recipient-dropdown')
      .shadow()
      .find('select')
      .select(1, { force: true });
    cy.tabToElement(Locators.BUTTONS.CATEGORY_RADIO_BUTTON)
      .first()
      .click();
    cy.tabToElement(Locators.MESSAGE_SUBJECT)
      .shadow()
      .find('#inputField')
      .type(Data.TEST_SUBJECT, { force: true });
    cy.get(Locators.MESSAGES_BODY)
      .shadow()
      .find('#textarea')
      .type(Data.TEST_MESSAGE_BODY, { force: true });
  };

  saveDraftByKeyboard = () => {
    cy.intercept(
      'POST',
      `${Paths.SM_API_BASE}/message_drafts`,
      mockDraftResponse,
    ).as('draft_message');
    cy.get(Locators.MESSAGES_BODY).click();
    cy.tabToElement(Locators.BUTTONS.SAVE_DRAFT);
    cy.realPress('Enter');
    cy.wait('@draft_message').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
  };

  saveDraftButton = () => {
    return cy.get(Locators.BUTTONS.SAVE_DRAFT);
  };

  saveDraft = draftMessage => {
    cy.intercept(
      'PUT',
      `/my_health/v1/messaging/message_drafts/${
        draftMessage.data.attributes.messageId
      }`,
      draftMessage,
    ).as('draft_message');

    cy.get(Locators.BUTTONS.SAVE_DRAFT).click();
    cy.wait('@draft_message').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
    cy.get(Locators.ALERTS.DRAFT_MESSAGE)
      .its('request.body')
      .then(message => {
        expect(message.category).to.eq(draftMessage.data.attributes.category);
        expect(message.subject).to.eq(draftMessage.data.attributes.subject);
        expect(message.body).to.eq(draftMessage.data.attributes.body);
      });
  };

  verifyAttachmentErrorMessage = errormessage => {
    cy.get(Locators.ALERTS.ERROR_MESSAGE)
      .should('have.text', errormessage)
      .should('be.visible');
  };

  closeAttachmentErrorPopup = () => {
    cy.get(Locators.ALERTS.ERROR_MODAL)
      .shadow()
      .find('[type="button"]')
      .first()
      .click();
  };

  attachMessageFromFile = filename => {
    const filepath = `src/applications/mhv-secure-messaging/tests/e2e/fixtures/mock-attachments/${filename}`;
    cy.get(Locators.ATTACH_FILE_INPUT).selectFile(filepath, {
      force: true,
    });
  };

  attachFewFiles = list => {
    for (let i = 0; i < list.length; i += 1) {
      this.attachMessageFromFile(list[i]);
    }
  };

  verifyAttachmentButtonText = (numberOfAttachments = 0) => {
    if (numberOfAttachments < 1) {
      cy.get(Locators.BUTTONS.ATTACH_FILE)
        .shadow()
        .find('[type="button"]')
        .should('contain', Data.ATTACH_FILE);
    } else {
      cy.get(Locators.BUTTONS.ATTACH_FILE)
        .shadow()
        .find('[type="button"]')
        .should('contain', Data.ATTACH_ADDITIONAL_FILE);
    }
  };

  verifyExpectedAttachmentsCount = expectedCount => {
    cy.get(Locators.ATTACHMENT_COUNT).should('contain', expectedCount);
  };

  removeAttachedFile = () => {
    cy.get(Locators.BUTTONS.REMOVE_ATTACHMENT).click({ force: true });
    cy.get(Locators.BUTTONS.CONFIRM_REMOVE_ATTACHMENT).click({
      force: true,
    });
  };

  verifyRemoveAttachmentButtonHasFocus = (_attachmentIndex = 0) => {
    cy.get(Locators.BUTTONS.REMOVE_ATTACHMENT)
      .eq(_attachmentIndex)
      .should('have.focus');
  };

  //* Refactor*Remove and consolidate
  selectSideBarMenuOption = menuOption => {
    if (menuOption === 'Inbox') {
      cy.get(Locators.FOLDERS.INBOX).click();
    }
    if (menuOption === 'Drafts') {
      cy.get(Locators.FOLDERS.DRAFTS).click();
    }
    if (menuOption === 'Sent') {
      cy.get(Locators.FOLDERS.SENT).click();
    }
    if (menuOption === 'Trash') {
      cy.get(Locators.FOLDERS.TRASH).click();
    }
    if (menuOption === 'My folders') {
      cy.get(Locators.FOLDERS.SIDEBAR).click();
    }
  };

  clickOnDeleteDraftButton = () => {
    cy.get(Locators.BUTTONS.CONTINUE_EDITING)
      .parent()
      .find('va-button[text="Delete draft"]')
      .click();
  };

  clickOnContinueEditingButton = () => {
    cy.get(Locators.BUTTONS.CONTINUE_EDITING)
      .shadow()
      .find('button')
      .contains(Data.CONTINUE_EDITING)
      .click();
  };

  verifyAlertModal = () => {
    cy.get(`h2`).should('contain', "We can't save this message yet");
  };

  verifyExpectedPageOpened = menuOption => {
    cy.get(Locators.HEADER_FOLDER)
      .contains(menuOption)
      .should('be.visible');
  };

  verifyComposePageValuesRetainedAfterContinueEditing = () => {
    // cy.get('[data-testid=compose-category-radio-button]')
    //   .should('have.value', 'OTHER')
    //   .and('have.attr', 'checked');
    cy.get(Locators.FIELDS.MESS_SUBJECT).should(
      'have.value',
      this.messageSubjectText,
    );
    cy.get('#compose-message-body').should(
      'have.value',
      `\n\n\nName\nTitleTest${this.messageBodyText}`,
    );
  };

  verifyRecipientNameText = (recipient = mockRecipients.data[0].id) => {
    cy.get(Locators.ALERTS.REPT_SELECT)
      .shadow()
      .find('select')
      .select(recipient)
      .should('contain', mockRecipients.data[0].attributes.name);
  };

  verifySubjectFieldText = subject => {
    cy.get(Locators.MESSAGE_SUBJECT).should('have.value', subject);
  };

  verifyClickableURLinMessageBody = url => {
    const {
      signatureName,
      signatureTitle,
      includeSignature,
    } = mockSignature.data;
    cy.get(Locators.MESSAGES_BODY).should(
      'have.attr',
      'value',
      `${includeSignature &&
        `\n\n\n${signatureName}\n${signatureTitle}`}${url}`,
    );
  };

  clickTrashButton = () => {
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${
        mockMessageResponse.data.attributes.messageId
      }`,
      mockMessageResponse,
    ).as('mockMessageResponse');
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${
        mockThreadResponse.data.at(2).attributes.messageId
      }`,
      mockThreadResponse,
    ).as('mockThreadResponse');
    cy.get(Locators.BUTTONS.BUTTON_TEXT).click({
      force: true,
    });
  };

  clickConfirmDeleteButton = () => {
    cy.get(Locators.ALERTS.DELETE_MESSAGE)
      .shadow()
      .find('button')
      .contains('Confirm')
      .should('be.visible')
      .click({ force: true });
  };

  verifyDeleteDraftSuccessfulMessageText = () => {
    cy.get('[data-testid="alert-text"]').should(
      'contain.text',
      Data.MESSAGE_MOVED_TO_TRASH,
    );
  };

  verifySelectRecipientErrorMessage = () => {
    cy.get(Locators.ALERTS.REPT_SELECT)
      .shadow()
      .find('[id="error-message"]')
      .should('contain', Data.PLEASE_SELECT_RECIPIENT);
  };

  verifySubjectErrorMessage = () => {
    cy.get(Locators.MESSAGES_BODY)
      .shadow()
      .find('[id=input-error-message]')
      .should('be.visible');
  };

  verifyBodyErrorMessage = () => {
    cy.get(Locators.MESSAGES_BODY)
      .shadow()
      .find('[id=input-error-message]')
      .should('be.visible');
  };

  verifyDraftSaveButtonOnFocus = () => {
    cy.get(Locators.BUTTONS.SAVE_DRAFT)
      .should('exist')
      .and('be.focused');
  };

  verifyAttachmentInfo = data => {
    cy.get(Locators.INFO.ATTACH_OPT).each((el, index) => {
      cy.wrap(el).should('have.text', data[index]);
    });
  };
}

export default new PatientComposePage();
