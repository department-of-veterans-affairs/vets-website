import SecureMessagingSite from './sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths, Locators, Data } from './utils/constants';
import mockFeatureToggles from './fixtures/toggles-response.json';
import SecureMessagingLandingPage from './pages/SecureMessagingLandingPage';

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

    cy.url().should('contain', Paths.UI_MAIN);
    cy.get(Locators.ACCORDIONS).should(
      'have.length',
      mockFeatureToggles.data.features.length,
    );
  });

  it('pilot ON landing page view', () => {
    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage(
      mockPilotFeatureToggles,
      Paths.UI_PILOT,
    );

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);

    cy.get(Locators.ACCORDIONS).should(
      'have.length',
      mockPilotFeatureToggles.data.features.length,
    );
    cy.url().should('contain', Paths.UI_PILOT);
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
