import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from './utils/constants';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToInterstitialPage();

    cy.get(Locators.ALERTS.VA_CRISIS_LINE).click();

    cy.realType('{esc}');

    cy.get(Locators.ALERTS.VA_CRISIS_LINE).should('have.focus');

    cy.get(Locators.ALERTS.VA_CRISIS_LINE).click();
    cy.get('.va-modal-close').click();
    cy.get(Locators.ALERTS.VA_CRISIS_LINE).should('have.focus');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
