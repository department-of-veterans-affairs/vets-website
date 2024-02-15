import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT } from './utils/constants';

describe('Secure Messaging Compose', () => {
  it('can send message', () => {
    const landingPage = new PatientInboxPage();
    const site = new SecureMessagingSite();
    site.login();
    landingPage.loadInboxMessages();
    landingPage.navigateToInterstitialPage();

    cy.get('[text="Connect with the Veterans Crisis Line"]').click();

    cy.realType('{esc}');

    cy.get('[text="Connect with the Veterans Crisis Line"]').should(
      'have.focus',
    );

    cy.get('[text="Connect with the Veterans Crisis Line"]').click();
    cy.get('.va-modal-close').click();
    cy.get('[text="Connect with the Veterans Crisis Line"]').should(
      'have.focus',
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, {});
  });
});
