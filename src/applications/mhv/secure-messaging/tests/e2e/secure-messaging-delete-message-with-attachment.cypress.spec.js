import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockMessages from './fixtures/messages-response.json';
import mockMessagewithAttachment from './fixtures/message-response-withattachments.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockThreadwithAttachment from './fixtures/thread-attachment-response.json';

describe('Secure Messaging - Delete Message with Attachment', () => {
  it('delete message with attachment', () => {
    const site = new SecureMessagingSite();
    const landingPage = new PatientInboxPage();
    const detailsPage = new PatientMessageDetailsPage();

    site.login();
    mockMessagewithAttachment.data.id = '7192838';
    mockMessagewithAttachment.data.attributes.messageId = '7192838';
    mockMessagewithAttachment.data.attributes.attachment = true;
    mockMessagewithAttachment.data.attributes.body = 'attachment';
    landingPage.loadInboxMessages(mockMessages, mockMessagewithAttachment);

    cy.intercept(
      'PATCH',
      `/my_health/v1/messaging/threads/${
        mockThreadwithAttachment.data.at(0).attributes.threadId
      }/move?folder_id=-3`,
      mockMessagewithAttachment,
    ).as('deleteMessagewithAttachment');

    cy.get('[data-testid="inbox-sidebar"] > a').click();

    detailsPage.loadMessageDetails(
      mockMessagewithAttachment,
      mockThreadwithAttachment,
    );
    cy.get('[data-testid="trash-button-text"]').click({
      waitforanimations: true,
    });

    cy.get('[data-testid=delete-message-modal]')
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
