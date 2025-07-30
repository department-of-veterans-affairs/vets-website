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
    PatientComposePage.interceptSentFolder();
  });

  it('verify care teams with electronic signature', () => {
    PatientComposePage.selectRecipient('Record Amendment Admin');
    PatientComposePage.verifyElectronicSignatureAlert();
    PatientComposePage.verifyElectronicSignature();
    PatientComposePage.verifyElectronicSignatureRequired();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify user can sign and send a message', () => {
    PatientComposePage.selectRecipient('Record Amendment Admin');
    PatientComposePage.verifyElectronicSignatureAlert();
    PatientComposePage.selectCategory();
    PatientComposePage.getMessageSubjectField().type(`ES test`, {
      force: true,
    });
    PatientComposePage.getMessageBodyField().type(`\nES tests text`, {
      force: true,
    });
    PatientComposePage.getElectronicSignatureField().type('Dusty Dump ', {
      force: true,
    });
    PatientComposePage.clickElectronicSignatureCheckbox();

    PatientComposePage.sendMessage(mockRequestBody, mockResponseBody);
    PatientComposePage.verifySendMessageConfirmationMessageText();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
