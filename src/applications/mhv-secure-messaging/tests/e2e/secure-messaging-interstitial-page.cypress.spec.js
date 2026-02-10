import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Locators } from './utils/constants';
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
    PatientInterstitialPage.getCrisisLineModal()
      .find(`button`)
      .click();
    PatientInterstitialPage.getCrisisLineLink().should('have.focus');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify crisis line modal', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToInterstitialPage();

    cy.get(Locators.ALERTS.VA_CRISIS_LINE).click();
    PatientInterstitialPage.getCrisisLineModal()
      .find(`h3`)
      .should(`include.text`, `We’re here anytime, day or night – 24/7`);
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
    PatientInterstitialPage.getCrisisLineModal().should(
      'include.text',
      `Get more resources`,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientInterstitialPage.getCrisisLineModal()
      .find(`button`)
      .click();
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
