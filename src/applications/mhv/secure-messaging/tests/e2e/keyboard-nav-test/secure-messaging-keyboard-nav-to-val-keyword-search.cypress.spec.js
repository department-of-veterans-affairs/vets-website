import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';

describe('Secure Messaging validate keyboard search Form Keyboard Nav', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientInboxPage();
  beforeEach(() => {
    site.login();
    landingPage.loadPage();
  });
  it('validate keywoard search', () => {
    cy.get('#select-search-folder-dropdown')
      .shadow()
      .find('select')
      .select(2);
    cy.get('[data-testid="search-keyword-text-input"]')
      .shadow()
      .find('[id="inputField"]')
      .type('test');
    cy.get('.search-button > .fas').click();
    cy.injectAxe();
    cy.axeCheck();
    cy.realPress(['Enter']);
    cy.as('[ data-testid="validate keywoard search"]');
    cy.intercept;
  });
});
