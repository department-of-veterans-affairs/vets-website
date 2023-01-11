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
}

export default PatientComposePage;
