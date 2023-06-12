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
    messageDetailsPage.MoveToMessagesFolder(mockMessages);
    messageDetailsPage.MoveMessageWithAttachement(
      mockMessagewithAttachment,
      mockThreadwithAttachment,
    );
    cy.wait('@moveMessagewithAttachment');
    cy.injectAxe();
    cy.axeCheck();
    landingPage.verifyMoveMessagewithAttachmentSuccessMessage();
    cy.get('@moveMessagewithAttachment')
      .its('response')
      .then(response => {
        cy.log(JSON.stringify(response));
        expect(response.body.data.id).to.include('7192838');
        expect(response.statusCode).to.eq(200);
      });
  });
});
