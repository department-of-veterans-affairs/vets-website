import mockDraftMessage from '../fixtures/message-draft-response.json';
import mockMessageResponse from '../fixtures/message-response.json';
import mockThreadResponse from '../fixtures/thread-response.json';
import mockSignature from '../fixtures/signature-response.json';
import { Locators, Paths, Data, Alerts } from '../utils/constants';
import { RxRenewalText } from '../../../util/constants';
import mockDraftResponse from '../fixtures/message-compose-draft-response.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';
import newDraft from '../fixtures/draftsResponse/drafts-single-message-response.json';
import SharedComponents from './SharedComponents';

class PatientComposePage {
  messageSubjectText = 'testSubject';

  messageBodyText = 'testBody';

  sendMessageButton = () => {
    return cy.findByTestId(Locators.BUTTONS.SEND_TEST_ID);
  };

  sendMessage = (mockRequest, mockResponse = mockDraftMessage) => {
    cy.intercept('POST', `${Paths.SM_API_EXTENDED}*`, mockResponse).as(
      'message',
    );
    cy.get(Locators.BUTTONS.SEND).contains('Send').click({ force: true });
    return cy
      .wait('@message')
      .its('request')
      .then(req => {
        const request = req.body;
        if (mockRequest) {
          expect(request.body).to.contain(mockRequest.body);
          expect(request.category).to.eq(mockRequest.category);
          expect(request.recipient_id).to.eq(mockRequest.recipient_id);
          expect(request.subject).to.eq(mockRequest.subject);
          if (mockRequest.station_number) {
            expect(request.station_number).to.eq(mockRequest.station_number);
          }
        }
        return req;
      });
  };

  sendMessageWithoutVerification = (mockResponse = mockDraftMessage) => {
    cy.intercept('POST', Paths.SM_API_EXTENDED, mockResponse).as('message');
    cy.get(Locators.BUTTONS.SEND).contains('Send').click({ force: true });
  };

  sendMessageByKeyboard = () => {
    cy.intercept('POST', Paths.SM_API_EXTENDED, mockDraftMessage).as('message');
    cy.findByTestId(Locators.FIELDS.MESSAGE_BODY).click();
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
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    cy.focused().should('contain.text', Data.SECURE_MSG_SENT_SUCCESSFULLY);
  };

  selectRecipient = (index = 1) => {
    cy.get(Locators.ALERTS.REPT_SELECT)
      .shadow()
      .find('select')
      .select(index, { force: true });
  };

  getComboBox = () => {
    return cy.get('va-combo-box').shadow().find(`#options`);
  };

  getComboBoxDropdown = () => {
    return cy
      .get('va-combo-box')
      .shadow()
      .find(Locators.DROPDOWN.RECIPIENTS_COMBO);
  };

  selectComboBoxRecipient = text => {
    const comboBox = this.getComboBox();
    comboBox.clear();
    comboBox.type(text, { waitForAnimations: true });
    comboBox.type('{enter}');
  };

  recipientTitle = () => {
    return cy.findByTestId(Locators.COMPOSE_RECIPIENT_TITLE);
  };

  validateRecipientTitle = expectedText => {
    this.recipientTitle().should('contain.text', expectedText);
  };

  categoryDropdown = () => {
    return cy.findByTestId(Locators.COMPOSE_CATEGORY_DROPDOWN);
  };

  selectCategory = (category = 'OTHER') => {
    this.categoryDropdown()
      .shadow()
      .find('select')
      .select(category, { force: true });
  };

  validateCategorySelection = category => {
    this.categoryDropdown().should('have.value', category);
  };

  validateLockedCategoryDisplay = () => {
    cy.findByTestId(Locators.LOCKED_CATEGORY_DISPLAY).should('be.visible');
    cy.findByTestId(Locators.LOCKED_CATEGORY_DISPLAY).should(
      'contain',
      RxRenewalText.LOCKED_CATEGORY_DISPLAY,
    );
    // Verify dropdown does not exist
    cy.findByTestId(Locators.COMPOSE_CATEGORY_DROPDOWN).should('not.exist');
  };

  getMessageSubjectField = () => {
    return cy
      .findByTestId(Locators.FIELDS.MESSAGE_SUBJECT_DATA_TEST_ID)
      .shadow()
      .find(`#inPutField`);
  };

  validateMessageSubjectField = expectedText => {
    this.getMessageSubjectField().should('have.value', expectedText);
  };

  getMessageBodyField = () => {
    return cy
      .findByTestId(Locators.FIELDS.MESSAGE_BODY)
      .shadow()
      .find(`#input-type-textarea`);
  };

  typeMessageBody = (text = '') => {
    return this.getMessageBodyField()
      .should('be.visible')
      .should('be.enabled')
      .clear()
      .type(text);
  };

  validateMessageBodyField = expectedText => {
    // Wait for the field to exist before validating
    cy.findByTestId(Locators.FIELDS.MESSAGE_BODY).should('exist');
    this.getMessageBodyField().should('have.value', expectedText);
  };

  getElectronicSignatureField = () => {
    return cy.get(Locators.FIELDS.EL_SIGN).find('#inputField');
  };

  enterDataToMessageSubject = (text = this.messageSubjectText) => {
    cy.findByTestId(Locators.FIELDS.MESSAGE_SUBJECT_DATA_TEST_ID)
      .shadow()
      .find(`#inputField`)
      .type(text, { force: true });
  };

  enterDataToMessageBody = (text = this.messageBodyText) => {
    cy.findByTestId(Locators.FIELDS.MESSAGE_BODY)
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
    // eslint-disable-next-line cypress/unsafe-to-chain-command
    return cy.focused().then(el => {
      const tagName = el.prop('tagName');
      expect(tagName).to.be.oneOf(allowedTags);
    });
  };

  clickOnSendMessageButton = (mockResponse = mockDraftMessage) => {
    cy.intercept('POST', Paths.INTERCEPT.MESSAGES, mockResponse).as('message');
    cy.get(Locators.BUTTONS.SEND).contains('Send').click();
  };

  keyboardNavToMessageBodyField = () => {
    return cy.findByTestId(Locators.FIELDS.MESSAGE_BODY);
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
    // Tab to category select and verify it's focusable
    cy.tabToElement('[data-testid="compose-message-categories"]')
      .should('be.visible')
      .invoke('attr', 'value', 'OTHER');
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
    cy.findByTestId(Locators.FIELDS.MESSAGE_BODY).click();
    cy.tabToElement(Locators.BUTTONS.SAVE_DRAFT);
    cy.realPress('Enter');
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
      `/my_health/v1/messaging/message_drafts/${draftMessage.data.attributes.messageId}`,
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

  saveNewDraft = (category, subject, response = newDraft) => {
    cy.intercept('POST', `${Paths.SM_API_BASE}/message_drafts`, response).as(
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

  closeAlertModal = () => {
    cy.get('va-modal[status="warning"]')
      .find('button.va-modal-close')
      .click({ force: true });
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

  attachFileButton = () => {
    return cy.findByTestId(Locators.BUTTONS.ATTACH_FILE);
  };

  attachMessageFromFile = (filename = Data.TEST_IMAGE) => {
    const filepath = `src/applications/mhv-secure-messaging/tests/e2e/fixtures/mock-attachments/${filename}`;
    cy.get(Locators.ATTACH_FILE_INPUT).selectFile(filepath, {
      force: true,
    });
  };

  attachFakeFile = (fileConfig, { verify = false } = {}) => {
    const content = 'x'.repeat(fileConfig.size);

    cy.get(Locators.ATTACH_FILE_INPUT).selectFile(
      {
        contents: Cypress.Buffer.from(content),
        fileName: fileConfig.fileName,
        mimeType: fileConfig.mimeType,
      },
      { force: true },
    );

    // Wait for file processing
    if (verify) cy.findByText(fileConfig.fileName).should('exist');
  };

  attachFakeFilesByCount = (numberOfFiles, { verify = false } = {}) => {
    for (let i = 0; i < numberOfFiles; i += 1) {
      // const fileConfig = Data[`FAKE_FILE_${i + 1}KB`];
      const content = 'x'.repeat(100 * 1024);

      cy.get(Locators.ATTACH_FILE_INPUT).selectFile(
        {
          contents: Cypress.Buffer.from(content),
          fileName: `FAKE_FILE_${i + 1}.pdf`,
          mimeType: 'application/pdf',
        },
        { force: true },
      );
    }

    // Wait for file processing
    if (verify)
      for (let i = 0; i < numberOfFiles; i += 1) {
        cy.findByText(`FAKE_FILE_${i + 1}.pdf`).should('exist');
      }
  };

  attachFewFiles = list => {
    for (let i = 0; i < list.length; i += 1) {
      this.attachMessageFromFile(list[i]);
    }
  };

  verifyAttachmentButtonText = (numberOfAttachments = 0) => {
    if (numberOfAttachments < 1) {
      this.attachFileButton()
        .shadow()
        .find('[type="button"]')
        .should('contain', Data.BUTTONS.ATTACH_FILE);
    } else {
      this.attachFileButton()
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
    this.attachFileButton().should(`be.focused`);
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
    cy.get(Locators.HEADER_FOLDER).contains(menuOption).should('be.visible');
  };

  verifyComposePageValuesRetainedAfterContinueEditing = () => {
    this.verifyRecipientNameText();
    cy.findByTestId(Locators.FIELDS.MESSAGE_SUBJECT_DATA_TEST_ID)
      .invoke(`val`)
      .should(`contain`, this.messageSubjectText);
    cy.findByTestId(Locators.FIELDS.MESSAGE_BODY)
      .invoke(`val`)
      .should(`contain`, this.messageBodyText);
  };

  verifyRecipientNameText = (recipient = mockRecipients.data[0].id) => {
    cy.get(Locators.ALERTS.REPT_SELECT)
      .shadow()
      .find('select')
      .select(recipient, { force: true });
    cy.get(Locators.ALERTS.REPT_SELECT)
      .shadow()
      .find('select')
      .should('contain', mockRecipients.data[0].attributes.name);
  };

  verifyClickableURLinMessageBody = url => {
    const { signatureName, signatureTitle } = mockSignature.data.attributes;
    cy.findByTestId(Locators.FIELDS.MESSAGE_BODY).should(
      'have.attr',
      'value',
      `\n\n\n${signatureName}\n${signatureTitle}\n${url}`,
    );
  };

  clickTrashButton = () => {
    cy.intercept(
      'GET',
      `${Paths.INTERCEPT.MESSAGES}/${mockMessageResponse.data.attributes.messageId}`,
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
      `${Paths.INTERCEPT.MESSAGE_THREADS}${mockResponse.data.attributes.threadId}/move?folder_id=-3`,
      {},
    ).as('deleteMessageWithAttachment');
    cy.get(Locators.ALERTS.DELETE_MESSAGE)
      .shadow()
      .find('button')
      .contains('Confirm')
      .should('be.visible')
      .click({ force: true });
  };

  openAttachmentInfo = () => {
    cy.get(`.attachments-section`).find(`.additional-info-title`).click();
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
    cy.findByText('Electronic signature').should('be.visible');
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
    cy.get(Locators.DROPDOWN.ADD_INFO)
      .find(`a[href*="contact-list"]`)
      .should(`be.visible`);
  };

  openRecipientsDropdown = () => {
    cy.get(Locators.DROPDOWN.ADD_INFO)
      .shadow()
      .find(`a`)
      .click({ force: true });
  };

  backToInbox = () => {
    SharedComponents.clickBackBreadcrumb();
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

  verifyAttchedFilesList = listLength => {
    cy.get(`.attachments-section`)
      .find(`.attachments-list`)
      .children()
      .should(`have.length`, listLength);
  };

  verifyRecipientsQuantityInGroup = (index, quantity) => {
    cy.findByTestId('compose-recipient-combobox')
      .find(`optgroup`)
      .eq(index)
      .find('option')
      .should(`have.length`, quantity);
  };

  verifyRecipientsGroupName = (index, text) => {
    cy.findByTestId('compose-recipient-combobox')
      .find(`optgroup`)
      .eq(index)
      .invoke('attr', 'label')
      .should(`eq`, text);
  };

  verifyFacilityNameByRecipientName = (recipientName, facilityName) => {
    cy.findByTestId('compose-recipient-combobox')
      .find('optgroup')
      .contains(recipientName)
      .parent('optgroup')
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
    cy.get(Locators.COMBO_BOX).find(`#options`).should('be.focused');
  };

  deleteUnsavedDraft = () => {
    // We need to delete the draft, so Cypress does not get stuck
    // with a warning dialog when the browser is closed.
    cy.findByRole('button', { name: 'Delete draft' }).click();
    // Click the confirm button in the confirmation modal.
    cy.findByTestId('confirm-delete-draft').click();
  };

  interceptSentFolder = () => {
    cy.intercept(
      'GET',
      `my_health/v1/messaging/folders/-1/threads*`,
      mockThreadResponse,
    ).as('sentFolder');
  };

  validateAddYourMedicationWarningBanner = beVisible => {
    const bannerText =
      'To submit your renewal request, you should fill in as many of the medication details as possible. You can find this information on your prescription label or in your prescription details page.';
    cy.findByTestId(Locators.ALERTS.ADD_MEDICATION_INFO_WARNING)
      .findByText('Add your medication information to this message')
      .should(beVisible ? 'be.visible' : 'not.be.visible');
    cy.findByTestId(Locators.ALERTS.ADD_MEDICATION_INFO_WARNING)
      .findByText(bannerText)
      .should(beVisible ? 'be.visible' : 'not.be.visible');
  };

  validateMessageBodyHint = expectedHint => {
    cy.findByTestId(Locators.FIELDS.MESSAGE_BODY)
      .shadow()
      .find('.usa-hint')
      .should('contain', expectedHint);
  };
}

export default new PatientComposePage();
