import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators, Data } from '../utils/constants';
import SecureMessagingLandingPage from '../pages/SecureMessagingLandingPage';

describe('Secure Messaging Verify Links and Buttons Keyboard Nav', () => {
  it('Tab to Links and Buttons on the Landing Page', () => {
    cy.viewport(1200, 800);
    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage();

    cy.tabToElement(Locators.ALERTS.INBOX_TEXT).should(
      'have.text',
      Data.GO_YOUR_INBOX,
    );

    cy.tabToElement(Locators.LINKS.CREATE_NEW_MESSAGE).should('have.focus');
    cy.realPress('Tab');
    cy.get(Locators.ALERTS.WELCOME_MESSAGE)
      .find('a')
      .should('have.focus');

    cy.get(Locators.FAQ_ACC_ITEM).each(el => {
      cy.realPress('Tab');
      cy.get(el).should('have.focus');
    });

    cy.get(Locators.ALERTS.BACK_TOP).scrollIntoView();

    cy.get(Locators.ALERTS.BACK_TOP)
      .shadow()
      .find('a')
      .should('be.visible')
      .and(`have.attr`, `href`, `#ds-back-to-top`);

    cy.realPress('Tab');
    cy.get(Locators.ALERTS.BACK_TOP).should('have.focus');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
