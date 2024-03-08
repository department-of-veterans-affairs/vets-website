import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockMessages from './fixtures/messages-response.json';
import mockMessagewithAttachment from './fixtures/message-response-withattachments.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockThreadwithAttachment from './fixtures/thread-attachment-response.json';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging - Delete Message with Attachment', () => {
  it('delete message with attachment', () => {
    const site = new SecureMessagingSite();
    const landingPage = new PatientInboxPage();
    const detailsPage = new PatientMessageDetailsPage();
    const composePage = new PatientComposePage();

    site.login();
    mockMessagewithAttachment.data.id = '7192838';
    mockMessagewithAttachment.data.attributes.messageId = '7192838';
    mockMessagewithAttachment.data.attributes.attachment = true;
    mockMessagewithAttachment.data.attributes.body = 'attachment';
    landingPage.loadInboxMessages(mockMessages, mockMessagewithAttachment);
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/0/messages?per_page=-1&useCache=false',
      mockMessages,
    ).as('messagesFolder');
    cy.intercept(
      'PATCH',
      `/my_health/v1/messaging/threads/${
        mockThreadwithAttachment.data.at(0).attributes.threadId
      }/move?folder_id=-3`,
      mockMessagewithAttachment,
    ).as('deleteMessagewithAttachment');

    detailsPage.loadMessageDetails(
      mockMessagewithAttachment,
      mockThreadwithAttachment,
    );
    composePage.clickTrashButton();

    composePage.clickConfirmDeleteButton();
    composePage.verifyDeleteDraftSuccessfulMessage();

    cy.wait('@deleteMessagewithAttachment');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
