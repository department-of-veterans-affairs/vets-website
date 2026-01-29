import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import PatientMessageDetailsPage from './pages/PatientMessageDetailsPage';
import { AXE_CONTEXT, Alerts, Locators } from './utils/constants';
import singleThreadResponse from './fixtures/thread-response-new-api.json';

describe('Secure Messaging Reply to Expired Message', () => {
  it('reply expired messages', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientMessageDetailsPage.loadSingleThread(singleThreadResponse);

    cy.get(Locators.ALERTS.OLD_MSG_HEAD)
      .should(`be.visible`)
      .and(`contain`, Alerts.OLD_MSG_HEAD);

    cy.get(`${Locators.ALERTS.OLD_MSG_HEAD}+p`).should(
      `contain`,
      Alerts.OLD_MSG_SUBHEAD,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
