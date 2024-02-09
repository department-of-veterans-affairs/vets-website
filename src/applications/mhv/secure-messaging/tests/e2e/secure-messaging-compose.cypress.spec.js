import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientComposePage from './pages/PatientComposePage';
import requestBody from './fixtures/message-compose-request-body.json';
import { AXE_CONTEXT } from './utils/constants';
import categories from './fixtures/categories-response.json';

describe('Secure Messaging Compose', () => {
  const landingPage = new PatientInboxPage();
  const composePage = new PatientComposePage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToComposePage();
  });
  it('can send message', () => {
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
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('verify radio buttons focus', () => {
    const listOfCategories = categories.data.attributes.messageCategoryType;

    cy.get(`#compose-message-categories${listOfCategories[0]}input`)
      .click()
      .should('be.focused');
    for (let i = 1; i < listOfCategories.length; i++) {
      cy.realPress('ArrowDown');
      cy.focused().should(
        'have.attr',
        'id',
        `compose-message-categories${listOfCategories[i]}input`,
      );
    }
  });
});
