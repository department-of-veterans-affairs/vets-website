import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import mockRequestBody from './fixtures/message-compose-DS-request-body.json';
import mockResponseBody from './fixtures/message-compose-DS-response-body.json';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Compose', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
  });
  it('verify user can send a message', () => {
    PatientComposePage.selectRecipient('Record Amendment Admin');
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(`DS test`);
    PatientComposePage.getMessageBodyField().type(`\nDS tests text`, {
      force: true,
    });

    PatientComposePage.verifyDigitalSignature();
    PatientComposePage.verifyDigitalSignatureRequired();

    PatientComposePage.getDigitalSignatureField().type('Dusty Dump ', {
      force: true,
    });

    PatientComposePage.sendMessage(mockRequestBody, mockResponseBody);
    PatientComposePage.verifySendMessageConfirmationMessageText();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
