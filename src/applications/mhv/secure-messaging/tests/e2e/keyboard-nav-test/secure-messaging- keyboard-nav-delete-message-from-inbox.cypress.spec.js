import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import mockMessages from '../fixtures/messages-response.json';
import mockMessagewithAttachment from '../fixtures/message-response-withattachments.json';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientMessageDetailsPage from '../pages/PatientMessageDetailsPage';
import mockThreadwithAttachment from '../fixtures/thread-attachment-response.json';
import PatientComposePage from '../pages/PatientComposePage';

describe('navigate delete message', () => {
  it('delete message', () => {
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

    detailsPage
      .loadMessageDetails(mockMessagewithAttachment, mockThreadwithAttachment)
      .then(() => {
        composePage.PressEnterOnTrashButton();
      });

    composePage.ConfirmDeleteWithEnterKey(mockThreadwithAttachment);
    composePage.verifyDeleteSuccessfulMessage();

    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
