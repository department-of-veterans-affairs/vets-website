import SecureMessagingSite from './sm_site/SecureMessagingSite';
import mockMessages from './fixtures/messages-response.json';
import mockMessagewithAttachment from './fixtures/message-response-withattachments.json';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import mockThreadwithAttachment from './fixtures/thread-attachment-response.json';
import PatientComposePage from './pages/PatientComposePage';
import { AXE_CONTEXT, Paths } from './utils/constants';

describe('Secure Messaging - Delete Message with Attachment', () => {
  it('delete message with attachment', () => {
    const detailsPage = new PatientMessageDetailsPage();
    // const composePage = new PatientComposePage();

    SecureMessagingSite.login();
    mockMessagewithAttachment.data.id = '7192838';
    mockMessagewithAttachment.data.attributes.messageId = '7192838';
    mockMessagewithAttachment.data.attributes.attachment = true;
    mockMessagewithAttachment.data.attributes.body = 'attachment';
    PatientInboxPage.loadInboxMessages(mockMessages, mockMessagewithAttachment);
    cy.intercept(
      'GET',
      `${
        Paths.INTERCEPT.MESSAGE_FOLDERS
      }/0/messages?per_page=-1&useCache=false`,
      mockMessages,
    ).as('messagesFolder');
    cy.intercept(
      'PATCH',
      `${Paths.INTERCEPT.MESSAGE_THREADS}${
        mockThreadwithAttachment.data.at(0).attributes.threadId
      }/move?folder_id=-3`,
      mockMessagewithAttachment,
    ).as('deleteMessagewithAttachment');

    detailsPage.loadMessageDetails(
      mockMessagewithAttachment,
      mockThreadwithAttachment,
    );
    PatientComposePage.clickTrashButton();

    PatientComposePage.clickConfirmDeleteButton();
    PatientComposePage.verifyDeleteDraftSuccessfulMessageText();

    cy.wait('@deleteMessagewithAttachment');
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
