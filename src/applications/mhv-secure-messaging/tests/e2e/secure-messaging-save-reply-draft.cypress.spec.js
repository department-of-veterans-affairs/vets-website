import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';
import PatientReplyPage from './pages/PatientReplyPage';
import mockMessages from './fixtures/messages-response.json';
import mockSingleThread from './fixtures/thread-response.json';
import { AXE_CONTEXT, Paths, Data, Locators } from './utils/constants';

describe('Secure Messaging Reply', () => {
  it('Axe Check Message Reply', () => {
    // define constants
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    const messageDetailsPage = new PatientMessageDetailsPage();
    const bodyText = ' Updated body text';

    const singleMessage = { data: mockSingleThread.data[0] };
    singleMessage.data.attributes.body = bodyText;

    // load single thread
    site.login();
    landingPage.loadInboxMessages(mockMessages);
    landingPage.loadSingleThread(mockSingleThread);

    // reply to message - // TODO add to a method - clickReplyButton
    cy.intercept(
      'GET',
      `${Paths.SM_API_EXTENDED}/${mockSingleThread.data[0].id}/thread*`,
      mockSingleThread,
    ).as('replyThread');

    cy.get(Locators.BUTTONS.REPLY).click({ force: true });
    PatientInterstitialPage.getContinueButton().click();

    // change message
    PatientReplyPage.getMessageBodyField().type(bodyText, {
      force: true,
    });

    // save changed message as a draft - // TODO add to method - saveNewDraft in PatientMessageDraftPage
    cy.intercept(
      'POST',
      `${Paths.SM_API_BASE}/message_drafts/${
        mockSingleThread.data[0].id
      }/replydraft`,
      singleMessage,
    ).as('replyThread');

    cy.get(Locators.BUTTONS.SAVE_DRAFT).click({ force: true });

    // assert message saved with updated body
    cy.get(Locators.ALERTS.SAVE_DRAFT).should(
      'include.text',
      Data.MESSAGE_WAS_SAVED,
    );

    // verify reply topic - // TODO probably unite to one method
    messageDetailsPage.replyToMessageTo(singleMessage);

    messageDetailsPage.replyToMessageSenderName(singleMessage); // TODO skipped for flakiness - verify by 200x pattern

    messageDetailsPage.replyToMessageRecipientName(singleMessage);

    messageDetailsPage.replyToMessageDate(singleMessage);

    messageDetailsPage.replyToMessageId(singleMessage);

    messageDetailsPage.replyToMessageBody(singleMessage); // TODO skipped for flakiness - verify by 200x pattern

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
