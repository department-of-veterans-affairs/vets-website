import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientKeywordSearchPage from '../pages/PatientKeywordSearchPage';

describe('Secure Messaging validate folder selection form dropdown', () => {
  const site = new SecureMessagingSite();
  const landingPage = new PatientKeywordSearchPage();
  beforeEach(() => {
    site.login();
    landingPage.loadPage();
  });
  it('validate folder selection', () => {
    landingPage.selectFolder('Inbox');
    // landingPage.verifySelectedFolder();
    cy.injectAxe();
    cy.axeCheck();
  });
});
