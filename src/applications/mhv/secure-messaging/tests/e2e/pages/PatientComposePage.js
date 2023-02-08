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
      .click({ waitforanimations: true });
    cy.wait('@message');
  };

  enterComposeMessageDetails = category => {
    cy.get('[data-testid="compose-recipient-select"]')
      .shadow()
      .find('[id="select"]')
      .select('###PQR TRIAGE_TEAM 747###');
    cy.get('[data-testid=compose-category-radio-button]')
      .shadow()
      .find('label')
      .contains(category)
      .click();
    cy.get('[data-testid="attach-file-input"]').selectFile(
      'src/applications/mhv/secure-messaging/tests/e2e/fixtures/test_image.jpg',
      { force: true },
    );
    cy.get('[data-testid="message-subject-field"]')
      .shadow()
      .find('[name="message-subject"]')
      .type('Test Subject');
    cy.get('[data-testid="message-body-field"]')
      .shadow()
      .find('[name="message-body"]')
      .type('Test message body');
  };

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

  saveDraft = () => {
    cy.intercept(
      'PUT',
      '/my_health/v1/messaging/message_drafts/*',
      mockDraftMessage,
    ).as('draft_message');

    cy.get('[data-testid="Save-Draft-Button"]').click();
    cy.wait('@draft_message').then(xhr => {
      // cy.log(xhr.responseBody);
      cy.log(xhr.requestBody);
      // expect(xhr.method).to.eq('POST');
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
}
export default PatientComposePage;
