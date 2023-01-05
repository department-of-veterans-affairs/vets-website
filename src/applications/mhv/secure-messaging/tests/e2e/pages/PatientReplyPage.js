import mockMessage from '../fixtures/message-response.json';

class PatientReplyPage {
  sendReplyMessage = messageId => {
    cy.intercept(
      'POST',
      `/my_health/v1/messaging/messages/${messageId}/reply`,
      mockMessage,
    ).as('replyMessage');
    cy.get('[data-testid="Send-Button"]')
      .get('[text="Send"]')
      .click();
    cy.wait('@replyMessage');
  };
}
export default PatientReplyPage;
