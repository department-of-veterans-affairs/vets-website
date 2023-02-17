import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientKeywordSearchPage from '../pages/PatientKeywordSearchPage';

describe('Secure Messaging validate keyboard search form Keyboard Nav', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientKeywordSearchPage();
  beforeEach(() => {
    site.login();
    landingPage.loadPage();
    cy.injectAxe();
    cy.axeCheck();
  });
  it('validate keywoard search', () => {
    landingPage.selectFolder('Inbox');
    landingPage.typeSearchInputFieldText('test');
    landingPage.submitSearch();
    cy.realPress('Tab');
    cy.get('[data-testid="keyword-search-input"]').should('exist');
  });
});
