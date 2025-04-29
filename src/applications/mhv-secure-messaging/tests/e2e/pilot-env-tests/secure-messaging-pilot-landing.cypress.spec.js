import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import { AXE_CONTEXT, Paths, Locators, Data } from '../utils/constants';
import mockFeatureToggles from '../fixtures/toggles-response.json';
import SecureMessagingLandingPage from '../pages/SecureMessagingLandingPage';
import PilotEnvPage from '../pages/PilotEnvPage';

describe('SM PILOT FEATURE FLAG', () => {
  const mockPilotFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
    {
      name: `mhv_secure_messaging_cerner_pilot`,
      value: true,
    },
  ]);
  it('pilot OF landing page view', () => {
    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage(mockFeatureToggles, Paths.UI_PILOT);

    PilotEnvPage.verifyUrl(Paths.UI_MAIN);
    cy.get(Locators.ACCORDIONS).should('have.length', 5);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('pilot ON landing page view', () => {
    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage(
      mockPilotFeatureToggles,
      Paths.UI_PILOT,
    );

    cy.wait('@Recipients')
      .its('request.url')
      .should('contain', 'requires_oh=');

    PilotEnvPage.verifyUrl(Paths.UI_PILOT);

    cy.get(Locators.ACCORDIONS).should('have.length', 6);

    cy.get(Locators.ACCORDIONS)
      .last()
      .should('be.visible');

    cy.get(Locators.ACCORDIONS)
      .last()
      .find('span')
      .should('have.text', Data.WHAT_SECURE_MSG_PILOT);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    // TODO text of expanded accordion TBD later. Test could be adjusted accordingly
  });

  it('redirect to pilot inbox page visiting sm-pilot', () => {
    const updatedFeatureToggle = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_cerner_pilot',
        value: true,
      },
      {
        name: 'mhv_secure_messaging_remove_landing_page',
        value: true,
      },
    ]);
    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage(
      updatedFeatureToggle,
      Paths.UI_PILOT,
    );
    cy.url().should(`include`, Paths.INBOX);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('redirect to inbox page visiting sm', () => {
    const updatedFeatureToggle = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_cerner_pilot',
        value: true,
      },
      {
        name: 'mhv_secure_messaging_remove_landing_page',
        value: true,
      },
    ]);
    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage(updatedFeatureToggle);
    cy.url().should(`include`, Paths.INBOX);
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
