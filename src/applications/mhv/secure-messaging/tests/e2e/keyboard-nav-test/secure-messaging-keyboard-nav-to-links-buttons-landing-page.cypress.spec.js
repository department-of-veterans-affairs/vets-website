import PatientInboxPage from '../pages/PatientInboxPage';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';

describe('Secure Messaging Verify Links and Buttons Keyboard Nav', () => {
  it('Tab to Links and Buttons on the Landing Page', () => {
    const site = new SecureMessagingSite();
    const landingPage = new PatientInboxPage();
    site.login();
    landingPage.loadInboxMessages();
    landingPage.loadLandingPagebyTabbingandEnterKey();
    cy.tabToElement('.sidebar-navigation-messages-list-header > a');
    cy.realPress(['Enter']);
    cy.tabToElement('[data-testid="compose-message-link"]').should(
      'be.focused',
    );
    cy.tabToElement('.vads-c-action-link--blue').should('be.focused');
    cy.tabToElement('.welcome-message > :nth-child(4) > a').should(
      'be.focused',
    );
    cy.tabToElement('.vads-u-padding-right--1 > .hydrated').should(
      'be.focused',
    );
    cy.injectAxe();
    cy.axeCheck();
  });
});
