import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import mockSignature from './fixtures/signature-response.json';
import { AXE_CONTEXT, Data, Paths } from './utils/constants';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientComposePage.interceptSentFolder();

    cy.intercept('GET', Paths.INTERCEPT.MESSAGE_SIGNATURE, mockSignature).as(
      'signature',
    );
    PatientInboxPage.navigateToComposePage();

    PatientComposePage.selectRecipient();
    PatientComposePage.selectCategory();
    PatientComposePage.attachMessageFromFile();
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT, {
      force: true,
    });

    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
    });
    PatientComposePage.sendMessageByKeyboard();
    PatientComposePage.verifySendMessageConfirmationMessageText();
    PatientComposePage.verifyHeader('Messages: Inbox');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
