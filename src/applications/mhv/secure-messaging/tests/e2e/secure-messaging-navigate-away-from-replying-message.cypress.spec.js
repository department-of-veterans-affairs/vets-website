import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('verify navigate away pop-up message', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();

  it.skip('navigate away by click on the inside link', () => {
    site.login();
    landingPage.loadInboxMessages();
    landingPage.replyToMessage();

    cy.get('#textarea').type('testMessageBody', {
      waitForAnimations: true,
      force: true,
    });

    cy.get(Locators.FOLDERS.INBOX).click();

    cy.get('[data-testid="reply-form"]')
      .find('h1')
      .should('have.text', "We can't save this message yet");

    cy.get('[data-testid="reply-form"]')
      .find('#modal-primary-button')
      .should('have.text', 'Continue editing');

    cy.get('[data-testid="reply-form"]')
      .find('#modal-secondary-button')
      .should('have.text', 'Delete draft');

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
