import SecureMessagingSite from './sm_site/SecureMessagingSite';
import SecureMessagingLandingPage from './pages/SecureMessagingLandingPage';
import { AXE_CONTEXT } from './utils/constants';

describe('SM main page', () => {
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

  it('verify header', () => {
    SecureMessagingLandingPage.verifyHeader();
  });

  it('verify paragraphs', () => {
    cy.get('h2[class="vads-u-margin-top--1"]').should('be.visible');
    cy.get('.secure-messaging-faq > .vads-u-margin-top--1').should(
      'be.visible',
    );
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
