import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageSentPage from './pages/PatientMessageSentPage';
import inboxMessages from './fixtures/thread-response-new-api.json';
import { AXE_CONTEXT, Data } from './utils/constants';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import singleThreadResponse from './fixtures/sentResponse/sent-thread-response.json';

describe('SM SENT MESSAGE READ RECEIPTS', () => {
  const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
    {
      name: 'mhv_secure_messaging_read_receipts',
      value: true,
    },
  ]);
  const updatedSingleThreadResponse = GeneralFunctionsPage.updatedThreadDates(
    singleThreadResponse,
  );

  beforeEach(() => {
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages(inboxMessages);
    PatientMessageSentPage.loadMessages();
  });

  it('verify sent message opened by care team', () => {
    PatientMessageSentPage.loadSingleThread(updatedSingleThreadResponse);
    PatientMessageSentPage.verifyReadReceipt(Data.READ_RECEIPT);
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify sent message not opened by care team', () => {
    const removedReadReceiptsSingleThreadResponse = {
      ...updatedSingleThreadResponse,
      data: updatedSingleThreadResponse.data.map(msg => ({
        ...msg,
        attributes: {
          ...msg.attributes,
          readReceipt: null,
        },
      })),
    };

    PatientMessageSentPage.loadSingleThread(
      removedReadReceiptsSingleThreadResponse,
    );

    PatientMessageSentPage.verifyReadReceipt(Data.UNREAD_RECEIPT);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
