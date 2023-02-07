import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';

describe('Secure Messaging validate keyboard search Form Keyboard Nav', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadPage();
  });
  it('validate keyboard search', () => {
    cy.get('[data-testid="search-keyword-text-input"]').type('inbox');
    cy.injectAxe();
    cy.axeCheck();
  });
});
