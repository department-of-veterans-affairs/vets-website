import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessagewithAttachment from '../fixtures/message-response-withattachments.json';
import mockThreadwithAttachment from '../fixtures/thread-attachment-response.json';
import mockMessages from '../fixtures/messages-response.json';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';

describe('keyboard nav Move Message ', () => {
  it('check nav move message', () => {
    const site = new SecureMessagingSite();
    const landingPage = new PatientInboxPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    site.login();
    mockMessagewithAttachment.data.id = '7192838';
    mockMessagewithAttachment.data.attributes.messageId = '7192838';
    mockMessagewithAttachment.data.attributes.attachment = true;
    mockMessagewithAttachment.data.attributes.body = 'attachment';
    landingPage.loadInboxMessages(mockMessages, mockMessagewithAttachment);
    cy.get('[data-testid="inbox-sidebar"] > a').type('{enter}');
    messageDetailsPage.loadMessageDetails(
      mockMessagewithAttachment,
      mockThreadwithAttachment,
    );
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages?per_page=-1&useCache=false',
      mockMessages,
    ).as('messagesFolder');
    cy.get('[data-testid="move-button-text"]').click({ force: true });
    cy.tabToElement('[data-testid="move-to-modal"]')
      .should('have.focus')
      .find('[class = "form-radio-buttons hydrated"]', {
        includeShadowDom: true,
      })
      .find('[id = "radiobutton-Deleted"]', { includeShadowDom: true })
      .type('{enter}');
    messageDetailsPage.KeyboardMoveMessage(
      mockMessagewithAttachment,
      mockThreadwithAttachment,
    );
    cy.injectAxe();
    cy.axeCheck();
    landingPage.verifyMoveMessagewithAttachmentSuccessMessage();
  });
});
