import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT } from './utils/constants';

for (let i = 0; i < 200; i += 1) {
  describe('Secure Messaging Compose', () => {
    it('can send message', () => {
      const site = new SecureMessagingSite();
      const patientInboxPage = new PatientInboxPage();
      site.login(false);
      site.loadPageUnauthenticated();

      cy.url().should('contain', '/my-health/secure-messages');

      site.login();

      patientInboxPage.loadInboxMessages();
      cy.get('[data-testid="inbox-sidebar"] > a').click();

      cy.injectAxe();
      cy.axeCheck(AXE_CONTEXT, {
        rules: {
          'aria-required-children': {
            enabled: false,
          },
        },
      });
    });
  });
}
