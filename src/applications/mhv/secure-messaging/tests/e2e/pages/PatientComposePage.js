import mockDraftMessage from '../fixtures/message-draft-response.json';
import mockMessageResponse from '../fixtures/message-response.json';
import mockThreadResponse from '../fixtures/thread-response.json';
import mockSignature from '../fixtures/signature-response.json';
import { Locators, Paths } from '../utils/constants';
import mockDraftResponse from '../fixtures/message-compose-draft-response.json';
import mockRecipients from '../fixtures/recipients-response.json';

class PatientComposePage {
  messageSubjectText = 'testSubject';

  messageBodyText = 'testBody';

  sendMessage = mockRequest => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/messages',
      mockDraftMessage,
    ).as('message');
    cy.get(Locators.BUTTONS.SEND)
      .contains('Send')
      .click({ force: true });
    cy.wait('@message')
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

  getCategory = (category = 'COVID') => {
    return cy.get(`#compose-message-categories${category}input`);
  };

  pushSendMessageWithKeyboardPress = () => {
    cy.intercept('POST', Paths.SM_API_EXTENDED, mockDraftMessage).as('message');
    cy.get(Locators.MESSAGES_BODY).click();
    cy.tabToElement(Locators.BUTTONS.SEND);
    cy.realPress(['Enter']);
    // cy.wait('@message');
  };

  verifySendMessageConfirmationMessageText = () => {
    cy.get(Locators.ALERTS.MAIN_CONTENT).should(
      'have.text',
      'Secure message was successfully sent.',
    );
  };

  verifySendMessageConfirmationMessageHasFocus = () => {
    cy.focused().should('contain.text', 'Secure message was successfully sent');
  };

  selectRecipient = (recipient = 1) => {
    cy.get(Locators.ALERTS.REPT_SELECT).click();
    cy.get(Locators.ALERTS.REPT_SELECT)
      .shadow()
      .find('[id="select"]')
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

  verifyFocusOnErrorMessageToSelectRecipient = () => {
    return cy
      .focused()
      .should('have.attr', 'error', 'Please select a recipient.');
  };

  verifyFocusOnErrorMessageToSelectCategory = () => {
    cy.focused().should('have.attr', 'error', 'Please select a category.');
  };

  verifyFocusOnErrorEmptyMessageSubject = () => {
    cy.focused().should('have.attr', 'error', 'Subject cannot be blank.');
  };

  verifyFocusOnErrorEmptyMessageBody = () => {
    cy.focused().should('have.attr', 'error', 'Message body cannot be blank.');
  };

  //* Refactor* Needs to have mockDraftMessage as parameter
  clickOnSendMessageButton = () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/messages',
      mockDraftMessage,
    ).as('message');
    cy.get(Locators.BUTTONS.SEND)
      .contains('Send')
      .click();
  };

  //* Refactor*  make parameterize mockDraftMessage
  sendDraft = draftMessage => {
    cy.intercept('POST', '/my_health/v1/messaging/messages', draftMessage).as(
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
      .find('#textarea');
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
      .find('#select')
      .select(1, { force: true });
    cy.tabToElement(Locators.BUTTONS.CATEGORY_RADIO_BUTTON)
      .first()
      .click();
    cy.tabToElement(Locators.MESSAGE_SUBJECT)
      .shadow()
      .find('#inputField')
      .type('testSubject', { force: true });
    cy.get(Locators.MESSAGES_BODY)
      .shadow()
      .find('#textarea')
      .type('testMessage', { force: true });
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
    const filepath = `src/applications/mhv/secure-messaging/tests/e2e/fixtures/mock-attachments/${filename}`;
    cy.get(Locators.ATTACH_FILE_INPUT).selectFile(filepath, {
      force: true,
    });
  };

  verifyAttachmentButtonText = (numberOfAttachments = 0) => {
    if (numberOfAttachments < 1) {
      cy.get(Locators.BUTTONS.ATTACH_FILE_BUTTON)
        .shadow()
        .find('[type="button"]')
        .should('contain', 'Attach file');
    } else {
      cy.get(Locators.BUTTONS.ATTACH_FILE_BUTTON)
        .shadow()
        .find('[type="button"]')
        .should('contain', 'Attach additional file');
    }
  };

  verifyExpectedAttachmentsCount = expectedCount => {
    cy.get(Locators.ATTACHMENT_COUNT).should('contain', expectedCount);
  };

  removeAttachMessageFromFile = () => {
    cy.get(Locators.BUTTONS.REMOVE_ATTACHMENT).click();
    cy.contains('Remove').click();
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
      cy.get(Locators.FOLDERS.DRAFT).click();
    }
    if (menuOption === 'Sent') {
      cy.get(Locators.FOLDERS.SENT).click();
    }
    if (menuOption === 'Trash') {
      cy.get(Locators.FOLDERS.Trash).click();
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

  verifyAlertModal = () => {
    cy.get(`[modaltitle="We can't save this message yet"]`)
      .shadow()
      .find('[class="va-modal-inner va-modal-alert"]')
      .should('contain', "We can't save this message yet");
  };

  clickOnContinueEditingButton = () => {
    cy.get(Locators.BUTTONS.CONTINUE_EDITING)
      .shadow()
      .find('button')
      .contains('Continue editing')
      .click();
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
    cy.get('#message-subject').should('have.value', this.messageSubjectText);
    cy.get('#compose-message-body').should(
      'have.value',
      `\n\n\nName\nTitleTest${this.messageBodyText}`,
    );
  };

  verifyRecipient = (recipient = mockRecipients.data[0].id) => {
    cy.get(Locators.ALERTS.REPT_SELECT)
      .shadow()
      .find('select')
      .select(recipient)
      .should('contain', mockRecipients.data[0].attributes.name);
  };

  verifySubjectField = subject => {
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
      `/my_health/v1/messaging/messages/${
        mockMessageResponse.data.attributes.messageId
      }`,
      mockMessageResponse,
    ).as('mockMessageResponse');
    cy.intercept(
      'GET',
      `/my_health/v1/messaging/messages/${
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

  verifyDeleteDraftSuccessfulMessage = () => {
    cy.get(Locators.ALERTS.MAIN_CONTENT).should(
      'have.text',
      'Message conversation was successfully moved to Trash.',
    );
  };

  verifySelectRecipientErrorMessage = () => {
    cy.get(Locators.ALERTS.REPT_SELECT)
      .shadow()
      .find('[id="error-message"]')
      .should('contain', ' Please select a recipient.');
  };

  verifyBodyErrorMessage = () => {
    cy.get(Locators.MESSAGES_BODY)
      .shadow()
      .find('[id=input-error-message]')
      .should('be.visible');
  };

  verifySubjectErrorMessage = () => {
    cy.get(Locators.MESSAGES_BODY)
      .shadow()
      .find('[id=input-error-message]')
      .should('be.visible');
  };
}

export default PatientComposePage;
