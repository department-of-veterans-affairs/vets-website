import PatientInboxPage from './pages/PatientInboxPage';
import SecureMessagingSite from './sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators, Data, Paths } from './utils/constants';

describe('Secure Messaging Compose with No Provider', () => {
  it('can not send message', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadPageForNoProvider();
    cy.get(Locators.ALERTS.TRIAGE_GROUP).should(
      'contain',
      Data.CANNOT_SEND_MSG_TO_CARE_TEAM,
    );
    cy.contains(
      'p',
      'If you need to contact your care teams, call your VA health facility.',
    ).should('be.visible');

    cy.get(Locators.ALERTS.TRIAGE_ALERT).should(
      'have.attr',
      'href',
      Paths.FIND_LOCATIONS,
    );

    cy.get(Locators.LINKS.CREATE_NEW_MESSAGE).should('not.exist');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
