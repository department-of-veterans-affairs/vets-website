import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDraftsPage from './pages/PatientMessageDraftsPage';
import PatientReplyPage from './pages/PatientReplyPage';
import mockMessages from './fixtures/messages-response.json';
import mockSingleThread from './fixtures/thread-response.json';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';
import PatientComposePage from './pages/PatientComposePage';

describe('SM REPLY ERRORS', () => {
  const bodyText = 'Updated body text';
  const singleMessage = { data: mockSingleThread.data[0] };
  singleMessage.data.attributes.body = `${bodyText}\n\n\nName\nTitletest`;

  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockMessages);
    PatientInboxPage.loadSingleThread(mockSingleThread);
    PatientMessageDetailsPage.clickReplyButton(mockSingleThread);
  });

  it('verify empty message body error', () => {
    PatientMessageDraftsPage.saveNewDraftMessage(
      mockSingleThread,
      singleMessage,
    );
    PatientComposePage.verifyErrorText(Data.BODY_CANNOT_BLANK);
    PatientComposePage.verifyFocusOnErrorMessage('TEXTAREA');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify deleted data in body error', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages(mockMessages);
    PatientInboxPage.loadSingleThread(mockSingleThread);
    PatientMessageDetailsPage.clickReplyButton(mockSingleThread);

    PatientReplyPage.getMessageBodyField().type(bodyText, {
      force: true,
    });

    PatientMessageDraftsPage.saveNewDraftMessage(
      mockSingleThread,
      singleMessage,
    );

    cy.get(Locators.ALERTS.SAVE_DRAFT).should(
      'include.text',
      Data.MESSAGE_WAS_SAVED,
    );

    PatientReplyPage.getMessageBodyField().clear({
      force: true,
    });

    PatientMessageDraftsPage.saveNewDraftMessage(
      mockSingleThread,
      singleMessage,
    );

    PatientComposePage.verifyErrorText(Data.BODY_CANNOT_BLANK);
    PatientComposePage.verifyFocusOnErrorMessage('TEXTAREA');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
