import SecureMessagingSite from './site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from '../fixtures/messages-response.json';

describe('Secure Messaging Sent Folder AXE Check', () => {
  it('Axe Check Sent Folder', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadPage();
    cy.intercept('GET', '/my_health/v1/messaging/folders/-1', mockMessages).as(
      'sentResponse',
    );
    cy.get('[data-testid="sent-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck();
  });
});
