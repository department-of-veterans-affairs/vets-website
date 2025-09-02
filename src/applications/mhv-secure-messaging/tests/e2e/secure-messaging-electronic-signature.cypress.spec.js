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

  it('verify Oracle Health ROI recipient requires electronic signature', () => {
    PatientComposePage.selectRecipient('VHA 649 Release of Information ROI');
    PatientComposePage.verifyElectronicSignatureAlert();
    PatientComposePage.verifyElectronicSignature();
    PatientComposePage.verifyElectronicSignatureRequired();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify Oracle Health Medical Records recipient requires electronic signature', () => {
    PatientComposePage.selectRecipient(
      'Ohio Columbus Release of Information – Medical Records',
    );
    PatientComposePage.verifyElectronicSignatureAlert();
    PatientComposePage.verifyElectronicSignature();
    PatientComposePage.verifyElectronicSignatureRequired();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify user can sign and send message to Oracle Health recipient', () => {
    PatientComposePage.selectRecipient(
      'Medical Center Release of Information Team',
    );
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

    const customMockResponse = {
      data: {
        ...mockResponseBody.data,
        id: '345678203847',
        attributes: {
          ...mockResponseBody.data.attributes,
          recipientId: 345678203847,
          recipientName: 'Medical Center Release of Information Team',
        },
      },
    };

    PatientComposePage.sendMessage(
      // eslint-disable-next-line camelcase
      { ...mockRequestBody, recipient_id: 345678203847 },
      customMockResponse,
    );
    PatientComposePage.verifySendMessageConfirmationMessageText();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
