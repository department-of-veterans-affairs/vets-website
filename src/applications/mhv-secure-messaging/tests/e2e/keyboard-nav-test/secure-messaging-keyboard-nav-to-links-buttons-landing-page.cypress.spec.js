import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators, Data } from '../utils/constants';
import SecureMessagingLandingPage from '../pages/SecureMessagingLandingPage';

// veification of 'Back to top' link slipped and will be fixed in separate PR
describe('Secure Messaging Verify Links and Buttons Keyboard Nav', () => {
  it('Tab to Links and Buttons on the Landing Page', () => {
    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage();

    cy.tabToElement('[text="Go to your inbox"]').should(
      'have.text',
      Data.GO_YOUR_INBOX,
    );

    cy.tabToElement(Locators.LINKS.CREATE_NEW_MESSAGE).should('have.focus');
    cy.realPress('Tab');
    cy.get(Locators.ALERTS.WELCOME_MESSAGE)
      .find('a')
      .should('have.focus');

    cy.get(Locators.ALERTS.ACC_ITEM).each(el => {
      cy.realPress('Tab');
      cy.get(el).should('have.focus');
    });

    cy.realPress('Tab');

    cy.get(Locators.ALERTS.BACK_TOP)
      .shadow()
      .find('a')
      .should(`have.attr`, `href`, `#ds-back-to-top`);

    cy.get(Locators.ALERTS.BACK_TOP).should('have.focus');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
