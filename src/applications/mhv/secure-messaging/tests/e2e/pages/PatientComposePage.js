import mockDraftMessage from '../fixtures/message-draft-response.json';

class PatientComposePage {
  sendMessage = () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/messages',
      mockDraftMessage,
    ).as('message');
    cy.get('[data-testid="Send-Button"]')
      .get('[text="Send"]')
      .click({ force: true });
    cy.wait('@message');
  };

  //* Refactor*  Need to get rid of this method and split out
  enterComposeMessageDetails = category => {
    this.selectRecipient('###PQR TRIAGE_TEAM 747###', { force: true });
    cy.get('[data-testid="compose-category-radio-button"]')
      .shadow()
      .find('label')
      .contains(category)
      .click({ force: true });
    cy.get('[data-testid="attach-file-input"]').selectFile(
      'src/applications/mhv/secure-messaging/tests/e2e/fixtures/test_image.jpg',
      { force: true },
    );
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
      .find('[name="message-body"]');
  };

  selectRecipient = recipient => {
    cy.get('[data-testid="compose-recipient-select"]')
      .shadow()
      .find('[id="select"]')
      .select(recipient);
  };

  //* Refactor* Needs to have mockDraftMessage as parameter
  clickOnSendMessageButton = () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/messages',
      mockDraftMessage,
    ).as('message');
    cy.get('[data-testid="Send-Button"]')
      .get('[text="Send"]')
      .click();
  };

  //* Refactor*  make parameterize mockDraftMessage
  sendDraft = (testId, testCategory, testSubject, testBody) => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/messages',
      mockDraftMessage,
    ).as('draft_message');
    cy.get('[data-testid="Send-Button"]').click();
    cy.wait('@draft_message').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
    cy.get('@draft_message')
      .its('request.body')
      .then(message => {
        expect(message.category).to.eq(testCategory);
        expect(message.subject).to.eq(testSubject);
        expect(message.body).to.eq(testBody);
      });
  };

  saveDraft = (testId, testCategory, testSubject, testBody) => {
    cy.intercept(
      'PUT',
      '/my_health/v1/messaging/message_drafts/*',
      mockDraftMessage,
    ).as('draft_message');

    cy.get('[data-testid="Save-Draft-Button"]').click();
    cy.wait('@draft_message').then(xhr => {
      cy.log(JSON.stringify(xhr.response.body));
    });
    cy.get('@draft_message')
      .its('request.body')
      .then(message => {
        expect(message.category).to.eq(testCategory);
        expect(message.subject).to.eq(testSubject);
        expect(message.body).to.eq(testBody);
      });
  };

  verifyAttachmentErrorMessage = errormessage => {
    cy.get('[data-testid="attach-file-error-modal"] p')
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
    cy.get('[id="message-body"]').should('have.value', 'Test message body');
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
}
export default PatientComposePage;
