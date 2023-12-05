import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import PatientInboxPage from '../pages/PatientInboxPage';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Keyboard Nav To Compose', () => {
  const site = new SecureMessagingSite();
  const patientInboxPage = new PatientInboxPage();
  beforeEach(() => {
    site.login();
    patientInboxPage.loadInboxMessages();
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
    cy.get('.page-title')
      .should('be.focused')
      .and('have.text', 'Start a new message');
  });
});
