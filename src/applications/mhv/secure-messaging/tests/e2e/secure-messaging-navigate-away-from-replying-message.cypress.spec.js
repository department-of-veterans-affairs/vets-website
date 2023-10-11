import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe.skip('verify signature', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();

  it('signature added on replying', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.replyToMessage();

    cy.get('#textarea').type('testMessageBody', {
      waitForAnimations: true,
      force: true,
    });

    cy.get(Locators.FOLDERS.INBOX).click();

    cy.get(Locators.HEADER).should('have.text', 'Inbox');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
