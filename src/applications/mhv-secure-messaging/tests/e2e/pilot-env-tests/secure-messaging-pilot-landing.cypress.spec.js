import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths, Locators, Data } from '../utils/constants';
import mockFeatureToggles from '../fixtures/toggles-response.json';
import SecureMessagingLandingPage from '../pages/SecureMessagingLandingPage';
import PilotEnvPage from '../pages/PilotEnvPage';

describe('Secure Messaging Pilot feature flag', () => {
  const pilotFeatureFlag = {
    name: 'mhv_secure_messaging_cerner_pilot',
    value: true,
  };
  const mockPilotFeatureToggles = {
    ...mockFeatureToggles,
    data: {
      ...mockFeatureToggles.data,
      features: [...mockFeatureToggles.data.features, pilotFeatureFlag],
    },
  };
  it('pilot OF landing page view', () => {
    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage(mockFeatureToggles, Paths.UI_PILOT);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PilotEnvPage.verifyUrl(Paths.UI_MAIN);
    cy.get(Locators.ACCORDIONS).should('have.length', 5);
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

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    PilotEnvPage.verifyUrl(Paths.UI_PILOT);

    cy.get(Locators.ACCORDIONS).should('have.length', 6);

    cy.get(Locators.ACCORDIONS)
      .last()
      .should('be.visible');

    cy.get(Locators.ACCORDIONS)
      .last()
      .find('span')
      .should('have.text', Data.WHAT_SECURE_MSG_PILOT);

    // TODO text of expanded accordion TBD later. Test could be adjusted accordingly
  });
});
