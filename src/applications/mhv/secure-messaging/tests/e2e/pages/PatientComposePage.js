import mockDraftMessage from '../fixtures/message-draft-response.json';

class PatientComposePage {
  sendMessage = () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/messages',
      mockDraftMessage,
    ).as('message');
    cy.get('[data-testid="Send-Button"]')
      .contains('Send')
      .click();
    cy.wait('@message');
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
}

export default PatientComposePage;
