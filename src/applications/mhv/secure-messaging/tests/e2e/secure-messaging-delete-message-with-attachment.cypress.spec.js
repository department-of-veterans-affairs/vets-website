import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockMessages from './fixtures/messages-response.json';
import mockMessagewithAttachment from './fixtures/message-response-withattachments.json';
import PatientInboxPage from './pages/PatientInboxPage';

describe('Secure Messaging - Delete Message with Attachment', () => {
  it('delete message with attachment', () => {
    const site = new SecureMessagingSite();
    const landingPage = new PatientInboxPage();

    site.login();
    site.loadPage();

    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages?per_page=-1&useCache=false',
      mockMessages,
    ).as('messagesFolder');
    cy.intercept(
      'DELETE',
      '/my_health/v1/messaging/messages/7192838',
      mockMessagewithAttachment,
    ).as('deleteMessagewithAttachment');

    cy.get('[data-testid="inbox-sidebar"] > a').click();

    cy.wait('@messagesFolder');
    mockMessagewithAttachment.data.id = '7192838';
    mockMessagewithAttachment.data.attributes.attachment = true;
    mockMessagewithAttachment.data.attributes.body = 'attachment';

    landingPage.loadMessagewithAttachments(mockMessagewithAttachment);

    cy.contains('General:').click({ timeout: 5000 });
    cy.get('[data-testid="trash-button-text"]').click({
      waitforanimations: true,
    });

    cy.get('[data-testid=delete-message-modal]', { timeout: 8000 })
      .shadow()
      .find('button')
      .contains('Confirm')
      .should('be.visible')
      .click();

    cy.wait('@deleteMessagewithAttachment');
    cy.injectAxe();
    cy.axeCheck();
  });
});
