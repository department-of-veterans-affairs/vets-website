import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import mockMessages from '../fixtures/messages-response.json';

describe('Secure Messaging Patient Message Count', () => {
  it('Patient Message Count', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages(mockMessages);
    cy.injectAxe();

    cy.get('[data-testid=thread-list-item]').should(
      'have.length',
      mockMessages.data.length,
    );
    cy.get('[data-testid="sent-sidebar"]').click();
    cy.get('[data-testid="displaying-number-of-threads"]')
      .invoke('text')
      .should(
        'contain',
        `Showing 1 to 10 of ${
          mockMessages.data.length
        } conversations unread messages`,
      );
    cy.axeCheck('main', {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
  });
});
