import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';

describe('Secure Messaging access custom folder Keyboard Nav', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  beforeEach(() => {
    site.login();
    landingPage.loadPage();
  });
  it('tab to inbox custom folder', () => {
    cy.get('[data-testid="Inbox"] > a').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('inbox custom folder').should('exist');
  });
  it('tab to drafts custom folder', () => {
    cy.get('[data-testid="Drafts"] > a').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="drafts custom folder"]').should('exist');
  });
  it('tab to sent custom folder', () => {
    cy.get('[data-testid="Sent"] > a').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="sent custom folder"]').should('type');
  });
  it('tab to trash custom folder', () => {
    cy.get('[data-testid="Deleted"]').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="trash custom folder"]').should('type');
  });
  it('tab to test2 custom folder', () => {
    cy.get('[data-testid="TEST2"] > a').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="TEST2"=test2 custom folder]').should('type');
  });
  it('tab to testagain custom folder', () => {
    cy.get('[data-testid="TESTAGAIN"] > a').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="testagain custom folder"]').should('type');
  });
});
