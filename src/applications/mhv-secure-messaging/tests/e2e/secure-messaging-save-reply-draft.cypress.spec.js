import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import PatientReplyPage from './pages/PatientReplyPage';
import mockMessages from './fixtures/threads-response.json';
import mockSingleThread from './fixtures/thread-response.json';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';

describe('Secure Messaging Reply', () => {
  it('Axe Check Message Reply', () => {
    // declare constants
    const bodyText = 'Updated body text';
    const singleMessage = { data: mockSingleThread.data[0] };
    singleMessage.data.attributes.body = bodyText;

    // load single thread
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockMessages);
    PatientInboxPage.loadSingleThread(mockSingleThread);

    // click reply btn
    PatientMessageDetailsPage.clickReplyButton(mockSingleThread);

    // verify reply header contains original category
    cy.get(`h1`).should(`contain`, `Messages: General`);

    // change message
    PatientReplyPage.getMessageBodyField().type(bodyText, {
      force: true,
    });

    // save changed message as a draft
    PatientMessageDraftsPage.saveNewDraftMessage(
      mockSingleThread,
      singleMessage,
    );

    // assert message saved
    cy.get(Locators.ALERTS.SAVE_DRAFT).should(
      'include.text',
      Data.MESSAGE_WAS_SAVED,
    );

    // verify reply topic
    PatientMessageDetailsPage.replyToMessageTo(singleMessage);

    // verify saved draft details
    PatientMessageDetailsPage.replyToMessageSenderName(singleMessage);

    PatientMessageDetailsPage.replyToMessageRecipientName(singleMessage);

    PatientMessageDetailsPage.replyToMessageDate(singleMessage);

    PatientMessageDetailsPage.replyToMessageId(singleMessage);

    PatientMessageDetailsPage.replyToMessageBody(singleMessage);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
