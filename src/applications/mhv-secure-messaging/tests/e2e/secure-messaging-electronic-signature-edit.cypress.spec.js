import SecureMessagingSite from './sm_site/SecureMessagingSite';
import PatientInboxPage from './pages/PatientInboxPage';
import { AXE_CONTEXT, Data, Locators } from './utils/constants';
import GeneralFunctionsPage from './pages/GeneralFunctionsPage';

describe('EDIT SIGNATURE FEATURE', () => {
  it('verify "Edit preferences" button', () => {
    SecureMessagingSite.login();
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();

    cy.get(Locators.BUTTONS.PREFERENCES).click();

    cy.get('.va-modal-alert-body')
      .find(Locators.HEADER2)
      .should('have.text', Data.EDIT_YOUR_MSG_PREFRENCES);
    cy.get(Locators.LINKS.PREFER_LINK)
      .should('have.attr', 'href')
      .and('contain', Data.LINKS.LEGACY_PREFERENCES);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify "Edit signature" link', () => {
    const updatedFeatureTogglesResponse = GeneralFunctionsPage.updateFeatureToggles(
      'mhv_secure_messaging_signature_settings',
      true,
    );

    SecureMessagingSite.login(updatedFeatureTogglesResponse);
    PatientInboxPage.loadInboxMessages();
    PatientInboxPage.navigateToComposePage();

    cy.get(Locators.BUTTONS.PREFERENCES).should(`not.exist`);
    cy.get(Locators.LINKS.EDIT_SIGNATURE)
      .should(`be.visible`)
      .and(`have.text`, Data.EDIT_SIGNATURE);

    cy.get(Locators.LINKS.EDIT_SIGNATURE)
      .find('a')
      .should('have.attr', `href`, Data.LINKS.PROFILE_SIGNATURE);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
