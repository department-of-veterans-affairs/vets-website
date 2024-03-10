import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging Compose with No Provider', () => {
  it('can not send message', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadPageForNoProvider();
    cy.get(Locators.ALERTS.TRIAGE_GROUP).should(
      'contain',
      "You can't send messages to your care teams right now",
    );
    cy.contains(
      'p',
      'If you need to contact your care teams, call your VA health facility.',
    ).should('be.visible');

    cy.get(Locators.ALERTS.TRIAGE_ALERT).should(
      'have.attr',
      'href',
      '/find-locations/',
    );

    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
