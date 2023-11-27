import SecureMessagingSite from './sm_site/SecureMessagingSite';
import SecureMessagingLandingPage from './pages/SecureMessagingLandingPage';
import { AXE_CONTEXT } from './utils/constants';

describe.skip('SM main page', () => {
  beforeEach(() => {
    const site = new SecureMessagingSite();
    site.login();
    SecureMessagingLandingPage.loadMainPage();
  });

  it('axe check', () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });

  it('verify headers', () => {
    SecureMessagingLandingPage.verifyHeader();
    SecureMessagingLandingPage.verifyUnreadMessagesNote();
  });

  it('verify main topics', () => {
    SecureMessagingLandingPage.verifyWelcomeMessage();
    SecureMessagingLandingPage.verifyFaqMessage();
  });

  it('verify faq accordions', () => {
    SecureMessagingLandingPage.verifyFaqAccordions();
  });

  it('verify the new message link', () => {
    cy.contains('Start a new message').click();
    cy.location('pathname').should('contain', 'new-message');
  });

  it('verify "Go to the inbox" link', () => {
    cy.contains('Go to your inbox').click({ force: true });
    cy.location('pathname').should('contain', 'inbox');
  });
});

describe('SM main page without API calls', () => {
  it('validate Inbox and New Message links exists in the page', () => {
    const site = new SecureMessagingSite();
    site.login();
    cy.visit('my-health/secure-messages/');

    cy.get('[data-testid="inbox-link"]').should('be.visible');
    cy.get('[data-testid="compose-message-link"]').should('be.visible');
  });
});
