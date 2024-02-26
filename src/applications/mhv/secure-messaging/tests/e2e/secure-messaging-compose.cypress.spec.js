import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import requestBody from './fixtures/message-compose-request-body.json';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging Compose', () => {
  const landingPage = new PatientInboxPage();
  const composePage = new PatientComposePage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
  });
  it('verify user can send a message', () => {
    composePage.selectRecipient(requestBody.recipientId);
    composePage
      .getCategory(requestBody.category)
      .first()
      .click();
    composePage.getMessageSubjectField().type(`${requestBody.subject}`);
    composePage
      .getMessageBodyField()
      .type(`${requestBody.body}`, { force: true });
    composePage.sendMessage(requestBody);
    composePage.verifySendMessageConfirmationMessageText();
    composePage.verifySendMessageConfirmationMessageHasFocus();

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

    composePage
      .getMessageSubjectField()
      .type(normalText, { waitForAnimations: true });
    cy.get(Locators.INFO.SUBJECT_LIMIT).should(
      'have.text',
      `${charsLimit - normalText.length} characters left`,
    );

    composePage
      .getMessageSubjectField()
      .clear()
      .type(maxText, { waitForAnimations: true });
    cy.get(Locators.INFO.SUBJECT_LIMIT).should(
      'have.text',
      `${charsLimit - maxText.length} characters left`,
    );

    composePage
      .getMessageSubjectField()
      .clear()
      .type(maxText, { waitForAnimations: true });
    cy.get('#message-subject').should('have.attr', 'value', maxText);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
