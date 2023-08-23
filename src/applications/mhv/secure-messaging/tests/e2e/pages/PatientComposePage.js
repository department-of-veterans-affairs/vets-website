import mockDraftMessage from '../fixtures/message-draft-response.json';
import mockMessageResponse from '../fixtures/message-response.json';
import mockThreadResponse from '../fixtures/thread-response.json';
import mockSignature from '../fixtures/signature-response.json';

class PatientComposePage {
  sendMessage = mockRequest => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/messages',
      mockDraftMessage,
    ).as('message');
    cy.get('[data-testid="Send-Button"]')
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

  getCategory = category => {
    return cy.get(`[name=${category}]`);
  };

  pushSendMessageWithKeyboardPress = () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/messages',
      mockDraftMessage,
    ).as('message');
    cy.tabToElement('[data-testid="Send-Button"]')
      .contains('Send')
      .realPress(['Enter']);
    // cy.wait('@message');
  };

  verifySendMessageConfirmationMessage = () => {
    cy.get('.vads-u-margin-bottom--1').should(
      'have.text',
      'Secure message was successfully sent.',
    );
  };

  verifySendMessageConfirmationMessageHasFocus = () => {
    cy.get('.vads-u-margin-bottom--1', { timeout: 5000 }).should('be.focused');
  };

  //* Refactor*  Need to get rid of this method and split out
  enterComposeMessageDetails = category => {
    this.selectRecipient('###PQR TRIAGE_TEAM 747###', { force: true });
    cy.get('[data-testid="compose-category-radio-button"]')
      .shadow()
      .find('label')
      .contains(category)
      .click({ force: true });
    // this.attachMessageFromFile('test_image.jpg');
    this.getMessageSubjectField().type('Test Subject');
    this.getMessageBodyField().type('Test message body');
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

  selectRecipient = recipient => {
    cy.get('[data-testid="compose-recipient-select"]')
      .shadow()
      .find('[id="select"]')
      .select(recipient);
  };

  selectCategoryByTabbingKeyboard = () => {
    cy.tabToElement('#OTHEROTHER');
    cy.realPress(['Enter']);
  };

  selectCategory = () => {
    cy.get('#OTHEROTHER').click({ force: true });
  };

  verifyFocusonMessageAttachment = () => {
    cy.get('.editable-attachment > span').should('have.focus');
  };

  verifyFocusOnErrorMessageToSelectRecipient = () => {
    cy.focused().should('have.attr', 'error', 'Please select a recipient.');
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
    cy.get('[data-testid="Send-Button"]')
      .contains('Send')
      .click();
  };

  //* Refactor*  make parameterize mockDraftMessage
  sendDraft = draftMessage => {
    cy.intercept('POST', '/my_health/v1/messaging/messages', draftMessage).as(
      'draft_message',
    );
    cy.get('[data-testid="Send-Button"]').click();
    cy.wait('@draft_message').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
    cy.get('@draft_message')
      .its('request.body')
      .then(message => {
        expect(message.category).to.eq(draftMessage.data.attributes.category);
        expect(message.subject).to.eq(draftMessage.data.attributes.subject);
        expect(message.body).to.eq(draftMessage.data.attributes.body);
      });
  };

  saveDraftButton = () => {
    return cy.get('[data-testid="Save-Draft-Button"]');
  };

  saveDraft = draftMessage => {
    cy.intercept(
      'PUT',
      `/my_health/v1/messaging/message_drafts/${
        draftMessage.data.attributes.messageId
      }`,
      draftMessage,
    ).as('draft_message');

    cy.get('[data-testid="Save-Draft-Button"]').click();
    cy.wait('@draft_message').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
    cy.get('@draft_message')
      .its('request.body')
      .then(message => {
        expect(message.category).to.eq(draftMessage.data.attributes.category);
        expect(message.subject).to.eq(draftMessage.data.attributes.subject);
        expect(message.body).to.eq(draftMessage.data.attributes.body);
      });
  };

  verifyAttachmentErrorMessage = errormessage => {
    cy.get('[data-testid="file-input-error-message"]')
      .should('have.text', errormessage)
      .should('be.visible');
  };

  closeAttachmentErrorPopup = () => {
    cy.get('[data-testid="attach-file-error-modal"]')
      .shadow()
      .find('[type="button"]')
      .first()
      .click();
  };

  attachMessageFromFile = filename => {
    const filepath = `src/applications/mhv/secure-messaging/tests/e2e/fixtures/${filename}`;
    cy.get('[data-testid="attach-file-input"]').selectFile(filepath, {
      force: true,
    });
  };

  removeAttachMessageFromFile = () => {
    cy.get('.remove-attachment-button').click();
    cy.contains('Remove').click();
  };

  //* Refactor*Remove and consolidate
  selectSideBarMenuOption = menuOption => {
    if (menuOption === 'Inbox') {
      cy.get('[data-testid=inbox-sidebar]').click();
    }
    if (menuOption === 'Drafts') {
      cy.get('[data-testid=drafts-sidebar]').click();
    }
    if (menuOption === 'Sent') {
      cy.get('[data-testid=sent-sidebar]').click();
    }
    if (menuOption === 'Trash') {
      cy.get('[data-testid=trash-sidebar]').click();
    }
    if (menuOption === 'My folders') {
      cy.get('[data-testid=my-folders-sidebar]').click();
    }
  };

  clickOnDeleteDraftButton = () => {
    cy.get('[primary-button-text="Continue editing"]')
      .shadow()
      .find('button')
      .contains('Delete draft')
      .click();
  };

  verifyAlertModal = () => {
    cy.get(`[modaltitle="We can't save this message yet"]`)
      .shadow()
      .find('[class="va-modal-inner va-modal-alert"]')
      .should('contain', "We can't save this message yet");
  };

  clickOnContinueEditingButton = () => {
    cy.get('[primary-button-text="Continue editing"]')
      .shadow()
      .find('button')
      .contains('Continue editing')
      .click();
  };

  verifyExpectedPageOpened = menuOption => {
    cy.get('[data-testid*=folder-header]')
      .contains(menuOption)
      .should('be.visible');
  };

  verifyComosePageValuesRetainedAfterContinueEditing = () => {
    cy.get('[data-testid=compose-category-radio-button]')
      .should('have.value', 'OTHER')
      .and('have.attr', 'checked');
    cy.get('[id="compose-message-body"]').should(
      'have.value',
      '\n\n\nName\nTitleTestTest message body',
    );
  };

  verifyRecipient = recipient => {
    cy.get('[data-testid="compose-recipient-select"]')
      .shadow()
      .find('select')
      .select(recipient)
      .should('contain', 'PQR TRIAGE');
  };

  verifySubjectField = subject => {
    cy.get('[id = "message-subject"]').should('have.value', subject);
  };

  verifyClickableURLinMessageBody = url => {
    const {
      signatureName,
      signatureTitle,
      includeSignature,
    } = mockSignature.data;
    cy.get('[data-testid="message-body-field"]').should(
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
    cy.get('[data-testid="trash-button-text"]').click({
      force: true,
    });
  };

  clickConfirmDeleteButton = () => {
    cy.get('[data-testid=delete-message-modal]')
      .shadow()
      .find('button')
      .contains('Confirm')
      .should('be.visible')
      .click({ force: true });
  };

  verifyDeleteDraftSuccessfulMessage = () => {
    cy.get('.vads-u-margin-bottom--1').should(
      'have.text',
      'Message conversation was successfully moved to Trash.',
    );
  };

  verifySelcteRespitantErrorMessage = () => {
    cy.get('[data-testid="compose-recipient-select"]')
      .shadow()
      .find('[id="error-message"]')
      .should('contain', ' Please select a recipient.');
  };

  verifyBodyErrorMessage = () => {
    cy.get('[data-testid="message-body-field"]')
      .shadow()
      .find('[id=error-message]')
      .should('be.visible');
  };

  verifySubjectErrorMessage = () => {
    cy.get('[data-testid="message-subject-field"]')
      .shadow()
      .find('[id=input-error-message]')
      .should('be.visible');
  };
}

export default PatientComposePage;
