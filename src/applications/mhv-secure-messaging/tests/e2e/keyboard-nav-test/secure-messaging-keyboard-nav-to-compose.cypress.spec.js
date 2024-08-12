import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT, Data, Locators } from '../utils/constants';

describe('Secure Messaging Keyboard Nav To Compose', () => {
  beforeEach(() => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
  });
  it('Keyboard Nav from Welcome Page to Compose', () => {
    cy.tabToElement('[data-testid="compose-message-link"]');
    cy.realPress(['Enter']);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {
      rules: {
        'aria-required-children': {
          enabled: false,
        },
      },
    });
    cy.tabToElement('[data-testid="continue-button"] ');
    cy.realPress(['Enter']);
    cy.get(Locators.ALERTS.PAGE_TITLE)
      .should('be.focused')
      .and('have.text', Data.START_NEW_MSG);
  });
});
