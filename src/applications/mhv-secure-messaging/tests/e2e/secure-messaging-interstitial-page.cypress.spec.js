import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT } from './utils/constants';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';
import PatientInterstitialPage from './pages/PatientInterstitialPage';

describe('SM INTERSTITIAL PAGE', () => {
  it('verify focus', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToInterstitialPage();

    GeneralFunctionsPage.getPageHeader().should('have.focus');

    PatientInterstitialPage.getCrisisLineLink().click();
    cy.realType('{esc}');
    PatientInterstitialPage.getCrisisLineLink().should('have.focus');

    PatientInterstitialPage.getCrisisLineLink().click();
    PatientInterstitialPage.getCrisisLineCloseButton().click({ force: true });
    PatientInterstitialPage.getCrisisLineLink().should('have.focus');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify crisis line modal', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToInterstitialPage();

    PatientInterstitialPage.getCrisisLineLink().click();
    cy.contains(`We’re here anytime, day or night – 24/7`).should('be.visible');
    PatientInterstitialPage.getCrisisLineModalLink()
      .eq(0)
      .should(`include.text`, `Call`);
    PatientInterstitialPage.getCrisisLineModalLink()
      .eq(1)
      .should(`include.text`, `Text`);
    PatientInterstitialPage.getCrisisLineModalLink()
      .eq(2)
      .should(`include.text`, `Start`);
    PatientInterstitialPage.getCrisisLineModalLink()
      .eq(3)
      .should(`include.text`, `For TTY`);
    cy.contains('Get more resources').should('be.visible');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientInterstitialPage.getCrisisLineCloseButton().click({ force: true });
  });

  it('verifies the page title', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToInterstitialPage();
    GeneralFunctionsPage.verifyPageTitle(
      'Only Use Messages For Non-Urgent Needs | Veterans Affairs',
    );
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
