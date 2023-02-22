import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockMessagewithAttachment from './fixtures/message-response-withattachments.json';
import mockMessages from './fixtures/messages-response.json';

describe('Secure Messaging - Move Message with Attachment', () => {
  it('can move with attachment', () => {
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
      'PATCH',
      '/my_health/v1/messaging/messages/7192838/move?folder_id=-3',
      mockMessagewithAttachment,
    ).as('moveMessagewithAttachment');

    cy.get('[data-testid="inbox-sidebar"] > a').click();
    cy.wait('@messagesFolder');
    mockMessagewithAttachment.data.id = '7192838';
    mockMessagewithAttachment.data.attributes.attachment = true;
    mockMessagewithAttachment.data.attributes.body = 'attachment';

    landingPage.loadMessagewithAttachments(mockMessagewithAttachment);

    cy.contains('General:').click();
    cy.get('[data-testid="move-button-text"]').click({ force: true });
    cy.get('[data-testid="move-to-modal"]')
      .find('[class = "form-radio-buttons hydrated"]', {
        includeShadowDom: true,
      })
      .find('[id = "radiobutton-Deleted"]', { includeShadowDom: true })
      .click();
    cy.get('[data-testid="move-to-modal"]')
      .shadow()
      .find('button')
      .contains('Confirm')
      .click();
    cy.wait('@moveMessagewithAttachment');
    cy.injectAxe();
    cy.axeCheck();
    landingPage.verifyMoveMessagewithAttachmentSuccessMessage();
    cy.get('@moveMessagewithAttachment')
      .its('response')
      .then(response => {
        expect(response.body.data.id).to.include('7192838');
      });
  });
});
