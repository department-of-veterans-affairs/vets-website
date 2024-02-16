import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Compose with No Provider', () => {
  it('can not send message', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadPageForNoProvider();

    cy.get('[data-testid="blocked-triage-group-alert"]>h2').should(
      'contain',
      "You can't send messages to your care teams right now",
    );
    cy.contains(
      'p',
      'If you need to contact your care teams, call your VA health facility.',
    ).should('be.visible');

    cy.get('[data-testid="blocked-triage-group-alert"] > div > a').should(
      'have.attr',
      'href',
      '/find-locations/',
    );

    cy.get('[data-testid="compose-message-link"]').should('not.exist');

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
