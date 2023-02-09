import SecureMessagingSite from '../sm_site/SecureMessagingSite';

describe('Secure Messaging access custom folder Keyboard Nav', () => {
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    site.loadPage();
  });
  it('tab to inbox custom folder', () => {
    cy.get('[data-testid="Inbox"] > a').click();
    cy.injectAxe();
    cy.axeCheck();
  });
  it('tab to drafts custom folder', () => {
    cy.get('[data-testid="Drafts"] > a').click();
    cy.injectAxe();
    cy.axeCheck();
  });
  it('tab to sent custom folder', () => {
    cy.get('[data-testid="Sent"] > a').click();
    cy.injectAxe();
    cy.axeCheck();
  });
  it('tab to trash custom folder', () => {
    cy.get('[data-testid="Deleted"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
  it('tab to test2 custom folder', () => {
    cy.get('[data-testid="TEST2"] > a').click();
    cy.injectAxe();
    cy.axeCheck();
  });
  it('tab to testagain custom folder', () => {
    cy.get('[data-testid="TESTAGAIN"] > a').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
