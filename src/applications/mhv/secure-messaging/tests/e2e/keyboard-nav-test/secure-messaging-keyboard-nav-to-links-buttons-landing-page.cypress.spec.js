import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators } from '../utils/constants';

describe('Secure Messaging Verify Links and Buttons Keyboard Nav', () => {
  it('Tab to Links and Buttons on the Landing Page', () => {
    const site = new SecureMessagingSite();
    const landingPage = new PatientInboxPage();
    site.login();
    landingPage.loadInboxMessages();
    cy.get(Locators.ALERTS.SIDEBAR_NAV).click();
    cy.get(Locators.ALERTS.INBOX_TEXT).should('be.visible');
    cy.tabToElement('[text="Go to your inbox"]').should(
      'have.text',
      'Go to your inbox',
    );

    cy.tabToElement('[data-testid="compose-message-link"]').should(
      'have.focus',
    );

    cy.realPress('Tab');
    cy.get(Locators.ALERTS.WELCOME_MESSAGE)
      .find('a')
      .should('have.focus');

    cy.realPress('Tab');
    cy.get(Locators.ALERTS.ACC_ITEM).each(el => {
      cy.get(el).should('have.focus');
      cy.realPress('Tab');
    });

    cy.get(Locators.ALERTS.BACK_TOP)
      .scrollIntoView()
      .should('have.focus');

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
