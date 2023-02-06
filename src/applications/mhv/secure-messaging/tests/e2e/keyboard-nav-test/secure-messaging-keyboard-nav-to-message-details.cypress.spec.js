import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';

describe('Secure Messaging Keyboard Nav to Message Details', () => {
  const site = new SecureMessagingSite();
  beforeEach(() => {
    site.login();
    site.loadPage();
  });
  it('Keyboard Nav from Welcome Page to Message Details', () => {
    const landingPage = new PatientInboxPage();
    cy.realPress(['Tab']);
    cy.tabToElement('a[href*="/my-health/secure-messages/inbox"]');
    cy.realPress(['Enter']);

    landingPage.loadPage();
    const message = landingPage.getLoadedMessages().data.at(1);
    landingPage.loadMessageDetailsByTabbingAndEnterKey(message);
    cy.injectAxe();
    cy.axeCheck();
  });
});
