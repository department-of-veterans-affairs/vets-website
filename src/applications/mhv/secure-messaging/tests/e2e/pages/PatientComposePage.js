import mockMessage from '../fixtures/message-response.json';

class PatientComposePage {
  sendMessage = () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/message_drafts',
      mockMessage,
    ).as('draft_message');
    cy.wait('@draft_message');
    cy.get('[data-testid="Send-Button"]')
      .contains('Send')
      .click();
  };
}

export default PatientComposePage;
