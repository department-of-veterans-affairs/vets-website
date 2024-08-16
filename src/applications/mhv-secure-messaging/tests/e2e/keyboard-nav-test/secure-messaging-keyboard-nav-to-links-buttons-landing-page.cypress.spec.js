import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators, Data } from '../utils/constants';
import SecureMessagingLandingPage from '../pages/SecureMessagingLandingPage';

describe('Secure Messaging Verify Links and Buttons Keyboard Nav', () => {
  it('Tab to Links and Buttons on the Landing Page', () => {
    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage();

    cy.tabToElement('[text="Go to your inbox"]').should(
      'have.text',
      Data.GO_YOUR_INBOX,
    );
    //
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
      .should('be.visible');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
