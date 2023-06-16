import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from '../fixtures/messages-response.json';

describe('Secure Messaging Sent Folder AXE Check', () => {
  it('Axe Check Sent Folder', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    cy.intercept('GET', '/my_health/v1/messaging/folders/-1', mockMessages);
    cy.intercept(
      'GET',
      '/my_health/v1/messaging/folders/-1/threads?pageSize=100&pageNumber=1&sortField=SENT_DATE&sortOrder=DESC',
      mockMessages,
    ).as('sentResponse');
    cy.get('[data-testid="sent-sidebar"]').click();
    cy.injectAxe();
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
