import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';

describe('Secure Messaging access custom folder Keyboard Nav', () => {
  const landingPage = new PatientInboxPage();
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    landingPage.loadPage();
  });
  it('tab to custom folder', () => {
    cy.get('.is-active > span').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
