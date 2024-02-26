import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import requestBody from './fixtures/message-compose-request-body.json';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging Compose Errors', () => {
  const landingPage = new PatientInboxPage();
  const composePage = new PatientComposePage();
  const site = new SecureMessagingSite();

  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
  });

  it('verify empty subject error', () => {
    composePage.selectRecipient(requestBody.recipientId);

    composePage
      .getCategory(requestBody.category)
      .first()
      .click();

    composePage
      .getMessageBodyField()
      .type(`${requestBody.body}`, { force: true });

    cy.get(Locators.BUTTONS.SEND)
      .contains('Send')
      .click({ force: true });

    composePage.verifyFocusOnErrorEmptyMessageSubject();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify empty message error', () => {
    composePage.selectRecipient(requestBody.recipientId);

    composePage
      .getCategory(requestBody.category)
      .first()
      .click();

    composePage
      .getMessageSubjectField()
      .type(`${requestBody.subject}`, { force: true });

    cy.get(Locators.BUTTONS.SEND)
      .contains('Send')
      .click({ force: true });

    composePage.verifyFocusOnErrorEmptyMessageBody();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
