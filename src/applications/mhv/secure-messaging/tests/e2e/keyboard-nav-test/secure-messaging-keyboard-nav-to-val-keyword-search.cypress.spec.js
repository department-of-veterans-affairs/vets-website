import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientKeywordSearchPage from '../pages/PatientKeywordSearchPage';

describe('Secure Messaging validate keyboard search form Keyboard Nav', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientKeywordSearchPage();
  beforeEach(() => {
    site.login();
    landingPage.loadPage();
  });
  it('validate keywoard search', () => {
    landingPage.selectFolder('Inbox');
    landingPage.typeSearchInputFieldText('Inbox');
    landingPage.submitSearch();
    cy.injectAxe();
    cy.axeCheck();
    cy.tabToElement('[data-testid="keyword-search-input"]').should('exist');
  });
});
