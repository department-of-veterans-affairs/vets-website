import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT } from '../utils/constants';

describe('Secure Messaging Verify Links and Buttons Keyboard Nav', () => {
  it('Tab to Links and Buttons on the Landing Page', () => {
    const site = new SecureMessagingSite();
    const landingPage = new PatientInboxPage();
    site.login();
    landingPage.loadInboxMessages();
    cy.get('[class="sidebar-navigation-messages-list-header"]').click();
    cy.get('[text="Go to your inbox"]').should('be.visible');
    cy.tabToElement('[text="Go to your inbox"]').should(
      'have.text',
      'Go to your inbox',
    );
    cy.tabToElement('[data-testid="compose-message-link"]').should(
      'have.focus',
    );
    cy.tabToElement('.welcome-message > :nth-child(3) > a').should(
      'have.focus',
    );
    cy.tabToElement('.welcome-message > :nth-child(4) > a').should(
      'have.focus',
    );
    cy.tabToElement('va-back-to-top').should('have.focus');
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
