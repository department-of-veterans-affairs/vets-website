import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import mockSignature from './fixtures/signature-response.json';
import { AXE_CONTEXT, Data, Paths } from './utils/constants';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();

    cy.intercept('GET', Paths.INTERCEPT.MESSAGE_SIGNATURE, mockSignature).as(
      'signature',
    );
    PatientInboxPage.navigateToComposePage();
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
    PatientComposePage.selectRecipient(
      'CAMRY_PCMM RELATIONSHIP_05092022_SLC4',
      {
        force: true,
      },
    );
    cy.get(`[data-testid="compose-message-categories"]`)
      .shadow()
      .get('input[value=COVID]')
      .click({ force: true });
    PatientComposePage.attachMessageFromFile(Data.TEST_IMAGE, { force: true });
    PatientComposePage.getMessageSubjectField().type(Data.TEST_SUBJECT, {
      force: true,
    });

    PatientComposePage.getMessageBodyField().type(Data.TEST_MESSAGE_BODY, {
      force: true,
    });
    PatientComposePage.pushSendMessageWithKeyboardPress();
    PatientComposePage.verifySendMessageConfirmationMessageText();
    // PatientInboxPage.verifyInboxHeader('Inbox');
  });
});
