import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientKeywordSearchPage from '../pages/PatientKeywordSearchPage';

describe('Secure Messaging access folder on landing page Keyboard Nav', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientKeywordSearchPage();
  beforeEach(() => {
    site.login();
    landingPage.loadPage();
  });
  it('tab to inbox folder', () => {
    cy.get('[data-testid="Inbox"] > a').realClick();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="keyword-search-input"]').should('exist');
  });
});
