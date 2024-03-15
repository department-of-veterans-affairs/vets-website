import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockMessagewithAttachment from './fixtures/message-response-withattachments.json';
import mockThreadwithAttachment from './fixtures/thread-attachment-response.json';
import mockMessages from './fixtures/messages-response.json';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT } from './utils/constants';
import FolderManagementPage from './pages/FolderManagementPage';

describe('Secure Messaging - Move Message with Attachment', () => {
  it('can move with attachment', () => {
    const site = new SecureMessagingSite();
    const landingPage = new PatientInboxPage();
    const folderPage = new FolderManagementPage();
    const messageDetailsPage = new PatientMessageDetailsPage();
    site.login();
    mockMessagewithAttachment.data.id = '7192838';
    mockMessagewithAttachment.data.attributes.messageId = '7192838';
    mockMessagewithAttachment.data.attributes.attachment = true;
    mockMessagewithAttachment.data.attributes.body = 'attachment';
    landingPage.loadInboxMessages(mockMessages, mockMessagewithAttachment);

    cy.get('.is-active').click();
    messageDetailsPage.loadMessageDetails(
      mockMessagewithAttachment,
      mockThreadwithAttachment,
    );
    folderPage.moveMessageWithAttachment();
    cy.wait('@moveMessageWithAttachment');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    landingPage.verifyMoveMessageWithAttachmentSuccessMessage();
    cy.get('@moveMessageWithAttachment')
      .its('response')
      .then(response => {
        cy.log(JSON.stringify(response));
        expect(response.body.data.id).to.include('7192838');
        expect(response.statusCode).to.eq(200);
      });
  });
});
