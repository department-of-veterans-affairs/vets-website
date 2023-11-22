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

  it('verify welcome messages', () => {
    cy.get('.welcome-message')
      .should('be.visible')
      .and('contain.text', 'What to know as you try out this tool');
    cy.get('.secure-messaging-faq')
      .should('be.visible')
      .and('contain.text', 'Questions about using messages');
  });

  it('verify faq accordions', () => {
    cy.get('[data-testid="faq-accordion-item"]').each(el => {
      cy.wrap(el)
        .should('be.visible')
        .click({ waitForAnimations: true });
      cy.wrap(el).should('have.attr', 'open');
    });
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
