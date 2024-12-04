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

    GeneralFunctionsPage.header.should('have.focus');

    PatientInterstitialPage.crisisLineLink.click();
    cy.realType('{esc}');
    PatientInterstitialPage.crisisLineLink.should('have.focus');

    PatientInterstitialPage.crisisLineLink.click();
    PatientInterstitialPage.crisisLineModal.find(`button`).click();
    PatientInterstitialPage.crisisLineLink.should('have.focus');

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify crisis line modal', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToInterstitialPage();

    cy.get(Locators.ALERTS.VA_CRISIS_LINE).click();
    PatientInterstitialPage.crisisLineModal
      .find(`h3`)
      .should(`include.text`, `We’re here anytime, day or night – 24/7`);
    PatientInterstitialPage.crisisLineModalLink
      .eq(0)
      .should(`include.text`, `Call`);
    PatientInterstitialPage.crisisLineModalLink
      .eq(1)
      .should(`include.text`, `Text`);
    PatientInterstitialPage.crisisLineModalLink
      .eq(2)
      .should(`include.text`, `Start`);
    PatientInterstitialPage.crisisLineModalLink
      .eq(3)
      .should(`include.text`, `For TTY`);
    PatientInterstitialPage.crisisLineModal.should(
      'include.text',
      `Get more resources`,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PatientInterstitialPage.crisisLineModal.find(`button`).click();
  });
});
