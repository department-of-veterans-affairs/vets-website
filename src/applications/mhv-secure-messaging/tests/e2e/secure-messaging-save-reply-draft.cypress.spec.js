import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import PatientReplyPage from './pages/PatientReplyPage';
import mockMessages from './fixtures/messages-response.json';
import mockSingleThread from './fixtures/thread-response.json';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';

describe('Secure Messaging Reply', () => {
  it('Axe Check Message Reply', () => {
    // declare pages & constants
    const site = new SecureMessagingSite();
    const draftPage = new PatientMessageDraftsPage();
    const messageDetailsPage = new PatientMessageDetailsPage();

    const bodyText = ' Updated body text';
    const singleMessage = { data: mockSingleThread.data[0] };
    singleMessage.data.attributes.body = bodyText;

    // load single thread
    site.login();
    PatientInboxPage.loadInboxMessages(mockMessages);
    PatientInboxPage.loadSingleThread(mockSingleThread);

    // click reply btn
    messageDetailsPage.clickReplyButton(mockSingleThread);

    // change message
    PatientReplyPage.getMessageBodyField().type(bodyText, {
      force: true,
    });

    // save changed message as a draft
    draftPage.saveNewDraftMessage(mockSingleThread, singleMessage);

    // assert message saved
    cy.get(Locators.ALERTS.SAVE_DRAFT).should(
      'include.text',
      Data.MESSAGE_WAS_SAVED,
    );

    // verify reply topic
    messageDetailsPage.replyToMessageTo(singleMessage);

    // verify saved draft details
    messageDetailsPage.replyToMessageSenderName(singleMessage);

    messageDetailsPage.replyToMessageRecipientName(singleMessage);

    messageDetailsPage.replyToMessageDate(singleMessage);

    messageDetailsPage.replyToMessageId(singleMessage);

    messageDetailsPage.replyToMessageBody(singleMessage);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
