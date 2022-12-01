import mockDraftMessage from '../fixtures/message-draft-response.json';

class PatientComposePage {
  sendMessage = () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/message_drafts',
      mockDraftMessage,
    ).as('draft_message');
    cy.wait('@draft_message');
    // .should(({ request, response }) => {
    //  const testRequest=request;
    //  const testResponse=response;
    // });
    cy.get('[data-testid="Send-Button"]')
      .contains('Send')
      .click();
  };

  saveDraft = () => {
    cy.intercept(
      'PUT',
      '/my_health/v1/messaging/message_drafts/*',
      mockDraftMessage,
    ).as('draft_message');
    cy.wait('@draft_message').then(xhr => {
      // cy.log(xhr.responseBody);
      cy.log(xhr.requestBody);
      // expect(xhr.method).to.eq('POST');
    });
    cy.get('[data-testid="Save-Draft-Button"]').click();
  };
}

export default PatientComposePage;
