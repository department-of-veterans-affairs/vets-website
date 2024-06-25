import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import requestBody from './fixtures/message-compose-request-body.json';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging Compose', () => {
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();
  });
  it('verify user can send a message', () => {
    PatientComposePage.selectRecipient(requestBody.recipientId);
    PatientComposePage.selectCategory(requestBody.category);
    PatientComposePage.getMessageSubjectField().type(`${requestBody.subject}`);
    PatientComposePage.getMessageBodyField().type(`${requestBody.body}`, {
      force: true,
    });
    PatientComposePage.sendMessage(requestBody);
    PatientComposePage.verifySendMessageConfirmationMessageText();
    PatientComposePage.verifySendMessageConfirmationMessageHasFocus();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify subject field max size', () => {
    const charsLimit = 50;
    const normalText = 'Qwerty1234';
    const maxText = 'Qwerty1234Qwerty1234Qwerty1234Qwerty1234Qwerty1234';

    cy.get(Locators.FIELDS.SUBJECT).should(
      'have.attr',
      'maxlength',
      `${charsLimit}`,
    );

    PatientComposePage.getMessageSubjectField().type(normalText, {
      waitForAnimations: true,
    });
    cy.get(Locators.INFO.SUBJECT_LIMIT).should(
      'have.text',
      `${charsLimit - normalText.length} characters left`,
    );

    PatientComposePage.getMessageSubjectField()
      .clear()
      .type(maxText, { waitForAnimations: true });
    cy.get(Locators.INFO.SUBJECT_LIMIT).should(
      'have.text',
      `${charsLimit - maxText.length} characters left`,
    );

    PatientComposePage.getMessageSubjectField()
      .clear()
      .type(maxText, { waitForAnimations: true });
    cy.get(Locators.FIELDS.MESS_SUBJECT).should(
      'have.attr',
      'value',
      `${maxText}`,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
