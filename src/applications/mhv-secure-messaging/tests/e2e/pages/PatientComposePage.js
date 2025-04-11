import mockDraftMessage from '../fixtures/message-draft-response.json';
import mockMessageResponse from '../fixtures/message-response.json';
import mockThreadResponse from '../fixtures/thread-response.json';
import mockSignature from '../fixtures/signature-response.json';
import { Locators, Paths, Data, Alerts } from '../utils/constants';
import mockDraftResponse from '../fixtures/message-compose-draft-response.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import newDraft from '../fixtures/draftsResponse/drafts-single-message-response.json';

class PatientComposePage {
  messageSubjectText = 'testSubject';

  messageBodyText = 'testBody';

  sendMessage = (mockRequest, mockResponse = mockDraftMessage) => {
    cy.intercept('POST', Paths.SM_API_EXTENDED, mockResponse).as('message');
    cy.get(Locators.BUTTONS.SEND)
      .contains('Send')
      .click({ force: true });
    cy.wait('@message')
      .its('request.body')
      .then(request => {
        if (mockRequest) {
          expect(request.body).to.contain(mockRequest.body);
          expect(request.category).to.eq(mockRequest.category);
          expect(request.recipient_id).to.eq(mockRequest.recipient_id);
          expect(request.subject).to.eq(mockRequest.subject);
        }
      });
  };

  sendMessageWithoutVerification = (mockResponse = mockDraftMessage) => {
    cy.intercept('POST', Paths.SM_API_EXTENDED, mockResponse).as('message');
    cy.get(Locators.BUTTONS.SEND)
      .contains('Send')
      .click({ force: true });
  };

  sendMessageByKeyboard = () => {
    cy.intercept('POST', Paths.SM_API_EXTENDED, mockDraftMessage).as('message');
    cy.get(Locators.FIELDS.MESSAGE_BODY).click();
    cy.tabToElement(Locators.BUTTONS.SEND);
    cy.realPress(['Enter']);
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
      'include.text',
      Data.SECURE_MSG_SENT_SUCCESSFULLY,
    );
  };

  verifySendMessageConfirmationMessageHasFocus = () => {
    cy.focused().should('contain.text', Data.SECURE_MSG_SENT_SUCCESSFULLY);
  };

  selectRecipient = (index = 1) => {
    cy.get(Locators.ALERTS.REPT_SELECT)
      .shadow()
      .find('select')
      .select(index, { force: true });
  };

  selectComboBoxRecipient = text => {
    cy.get(`#options`)
      .clear()
      .type(text);
  };

  selectCategory = (category = 'OTHER') => {
    cy.get(`#compose-message-categories${category}input`).click({
      force: true,
    });
  };

  getMessageSubjectField = () => {
    return cy
      .get(Locators.FIELDS.MESSAGE_SUBJECT)
      .shadow()
      .find(`#inPutField`);
  };

  getMessageBodyField = () => {
    return cy
      .get(Locators.FIELDS.MESSAGE_BODY)
      .shadow()
      .find(`#input-type-textarea`);
  };

  getElectronicSignatureField = () => {
    return cy.get(Locators.FIELDS.EL_SIGN).find('#inputField');
  };

  enterDataToMessageSubject = (text = this.messageSubjectText) => {
    cy.get(Locators.FIELDS.MESSAGE_SUBJECT)
      .shadow()
      .find(`#inputField`)
      .type(text, { force: true });
  };

  enterDataToMessageBody = (text = this.messageBodyText) => {
    cy.get(Locators.FIELDS.MESSAGE_BODY)
      .shadow()
      .find(`#input-type-textarea`)
      .type(text, { force: true });
  };

  verifyFocusOnAttachmentMessage = () => {
    cy.get(Locators.ALERTS.SUCCESS_ALERT)
      .should('be.visible')
      .should('have.focus');
  };

  verifyErrorText = text => {
    cy.get('.usa-error-message').should('contain.text', text);
  };

  verifyFocusOnErrorMessage = () => {
    const allowedTags = ['INPUT', 'TEXTAREA', 'SELECT', `BUTTON`];
    return cy.focused().then(el => {
      const tagName = el.prop('tagName');
      expect(tagName).to.be.oneOf(allowedTags);
    });
  };

  clickOnSendMessageButton = (mockResponse = mockDraftMessage) => {
    cy.intercept('POST', Paths.INTERCEPT.MESSAGES, mockResponse).as('message');
    cy.get(Locators.BUTTONS.SEND)
      .contains('Send')
      .click();
  };

  keyboardNavToMessageBodyField = () => {
    return cy.get(Locators.FIELDS.MESSAGE_BODY);
  };

  keyboardNavToMessageSubjectField = () => {
    return cy
      .tabToElement(Locators.FIELDS.MESSAGE_SUBJECT)
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
    cy.get(Locators.FIELDS.MESSAGE_BODY).click();
    cy.tabToElement(Locators.BUTTONS.SAVE_DRAFT);
    cy.realPress('Enter');
    cy.wait('@draft_message');
  };

  clickSaveDraftBtn = () => {
    cy.get(Locators.BUTTONS.SAVE_DRAFT).click({ force: true });
  };

  clickSaveDraftWithoutAttachmentBtn = () => {
    cy.contains(`without`).click({ force: true });
  };

  saveDraft = draftMessage => {
    cy.intercept(
      'PUT',
      `/my_health/v1/messaging/message_drafts/${
        draftMessage.data.attributes.messageId
      }`,
      { ok: true },
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

  saveNewDraft = (category, subject) => {
    cy.intercept('POST', `${Paths.SM_API_BASE}/message_drafts`, newDraft).as(
      'new_draft',
    );
    cy.get(Locators.BUTTONS.SAVE_DRAFT).click();

    cy.get('@new_draft')
      .its('request.body')
      .then(message => {
        expect(message.category).to.eq(category);
        expect(message.subject).to.eq(subject);
      });
  };

  verifyAttachmentErrorMessage = errormessage => {
    cy.get(Locators.ALERTS.ERROR_MESSAGE)
      .should('have.text', errormessage)
      .should('be.visible');

    cy.get(`.attachments-section`)
      .find(`.file-input`)
      .should(`have.css`, `border-left-width`, `4px`);
  };

  closeAlertModal = () => {
    cy.get(`.first-focusable-child`).click({ force: true });
  };

  closeAttachmentErrorModal = () => {
    cy.get(Locators.ALERTS.ERROR_MODAL)
      .shadow()
      .find('[type="button"]')
      .first()
      .click();
  };

  closeESAlertModal = () => {
    cy.get(Locators.ALERTS.ALERT_MODAL)
      .shadow()
      .find(`button`)
      .click({ force: true });
  };

  attachMessageFromFile = (filename = Data.TEST_IMAGE) => {
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
        .should('contain', Data.BUTTONS.ATTACH_FILE);
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

  verifyAttachButtonHasFocus = () => {
    cy.get(Locators.BUTTONS.ATTACH_FILE).should(`be.focused`);
  };

  clickDeleteDraftModalButton = () => {
    cy.get(`va-button[secondary][text="Delete draft"]`).click();
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
    this.verifyRecipientNameText();
    cy.get(Locators.FIELDS.MESSAGE_SUBJECT)
      .invoke(`val`)
      .should(`contain`, this.messageSubjectText);
    cy.get(Locators.FIELDS.MESSAGE_BODY)
      .invoke(`val`)
      .should(`contain`, this.messageBodyText);
  };

  verifyRecipientNameText = (recipient = mockRecipients.data[0].id) => {
    cy.get(Locators.ALERTS.REPT_SELECT)
      .shadow()
      .find('select')
      .select(recipient, { force: true })
      .should('contain', mockRecipients.data[0].attributes.name);
  };

  verifyClickableURLinMessageBody = url => {
    const { signatureName, signatureTitle } = mockSignature.data.attributes;
    cy.get(Locators.FIELDS.MESSAGE_BODY).should(
      'have.attr',
      'value',
      `\n\n\n${signatureName}\n${signatureTitle}\n${url}`,
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

  clickConfirmDeleteButton = mockResponse => {
    cy.intercept(
      'PATCH',
      `${Paths.INTERCEPT.MESSAGE_THREADS}${
        mockResponse.data.attributes.threadId
      }/move?folder_id=-3`,
      {},
    ).as('deleteMessageWithAttachment');
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
    cy.get(Locators.ALERTS.FIELD_ERROR)
      .should('be.visible')
      .and(`include.text`, Data.SUBJECT_CANNOT_BLANK);
  };

  verifyBodyErrorMessage = () => {
    cy.get(Locators.ALERTS.FIELD_ERROR)
      .should('be.visible')
      .and(`include.text`, Data.BODY_CANNOT_BLANK);
  };

  verifyAttachmentInfo = data => {
    cy.get(Locators.INFO.ATTACH_OPT).each((el, index) => {
      cy.wrap(el).should('have.text', data[index]);
    });
  };

  verifyElectronicSignatureAlert = () => {
    cy.get(`[data-testid="signature-alert"]`).should(
      `have.text`,
      Alerts.EL_SIGN,
    );
  };

  verifyElectronicSignature = () => {
    cy.get('va-card')
      .find('h2')
      .should('have.text', 'Electronic signature');
  };

  verifyElectronicSignatureRequired = () => {
    cy.get('va-card')
      .find('va-text-input')
      .shadow()
      .find('#input-label')
      .should('contain.text', 'Required');
  };

  clickElectronicSignatureCheckbox = () => {
    cy.get(`va-checkbox`)
      .shadow()
      .find(`#checkbox-element`)
      .click({ force: true });
  };

  getAlertEditDraftBtn = () => {
    return cy.get(Locators.ALERTS.ALERT_MODAL).find('va-button');
  };

  verifyHeader = text => {
    cy.get(Locators.HEADER).should(`have.text`, text);
  };

  verifyAdditionalInfoDropdownStatus = value => {
    cy.get(Locators.DROPDOWN.ADD_INFO)
      .shadow()
      .find(`a`)
      .should(`have.attr`, `aria-expanded`, value);
  };

  verifyAdditionalInfoDropdownLinks = () => {
    // verify `find-locations` link
    cy.get(Locators.DROPDOWN.ADD_INFO)
      .find(`a[href*="preferences"]`)
      .should(`be.visible`);

    // verify `preferences` link
    cy.get(Locators.DROPDOWN.ADD_INFO)
      .find(`a[href*="locations"]`)
      .should(`be.visible`)
      .and('not.have.attr', `target`, `_blank`);
  };

  openRecipientsDropdown = () => {
    cy.get(Locators.DROPDOWN.ADD_INFO)
      .shadow()
      .find(`a`)
      .click({ force: true });
  };

  backToInbox = () => {
    cy.get(Locators.BACK_TO).click();
  };

  verifyCantSaveAlert = (
    alertText,
    firstBtnText = `Edit draft`,
    secondBtnText = `Delete draft`,
  ) => {
    cy.get(`[status="warning"]`)
      .find(`h2`)
      .should('be.visible')
      .and(`have.text`, alertText);

    cy.get(`[status="warning"]`)
      .find(`[text='${firstBtnText}']`)
      .shadow()
      .find(`button`)
      .should('be.visible')
      .and(`have.text`, firstBtnText);

    cy.get(`[status="warning"]`)
      .find(`[text='${secondBtnText}']`)
      .shadow()
      .find(`.last-focusable-child`)
      .should('be.visible')
      .and(`have.text`, secondBtnText);
  };

  verifyAttchedFilesList = listLength => {
    cy.get(`.attachments-section`)
      .find(`.attachments-list`)
      .children()
      .should(`have.length`, listLength);
  };

  verifyRecipientsQuantityInGroup = (index, quantity) => {
    cy.get(Locators.DROPDOWN.RECIPIENTS)
      .find(`optgroup`)
      .eq(index)
      .find('option')
      .should(`have.length`, quantity);
  };

  verifyRecipientsGroupName = (index, text) => {
    cy.get(Locators.DROPDOWN.RECIPIENTS)
      .find(`optgroup`)
      .eq(index)
      .invoke('attr', 'label')
      .should(`eq`, text);
  };

  verifyFacilityNameByRecipientName = (recipientName, facilityName) => {
    cy.contains(recipientName)
      .parent()
      .should('have.attr', 'label', facilityName);
  };

  verifyRecipientsDropdownList = text => {
    cy.get(Locators.DROPDOWN.RECIPIENTS_COMBO)
      .find('li')
      .each(el => {
        cy.wrap(el).should(`contain.text`, text);
      });
  };

  verifyRecipientSelected = value => {
    cy.get(Locators.COMBO_BOX)
      .invoke('attr', 'data-default-value')
      .should('eq', value);
  };

  verifyRecipientsFieldAlert = text => {
    cy.get(Locators.ALERTS.COMBO_BOX).should(`have.text`, text);
    // temporary commented out / awaiting proper focus behavior confirmation
    // cy.get(Locators.COMBO_BOX).should('be.focused');
  };
}

export default new PatientComposePage();
