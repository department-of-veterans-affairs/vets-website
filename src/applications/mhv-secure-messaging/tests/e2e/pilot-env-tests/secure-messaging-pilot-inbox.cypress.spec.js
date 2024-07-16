import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths } from '../utils/constants';
import mockFeatureToggles from '../fixtures/toggles-response.json';
import SecureMessagingLandingPage from '../pages/SecureMessagingLandingPage';
import PilotEnvPage from '../pages/PilotEnvPage';
import mockMessages from '../fixtures/pilot-responses/inbox-threads-OH-response.json';
import mhvMessages from '../fixtures/pilot-responses/inbox-threads-response.json';

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

  it('pilot ON inbox page view', () => {
    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage(
      mockPilotFeatureToggles,
      Paths.UI_PILOT,
    );

    PilotEnvPage.loadInboxMessages();

    PilotEnvPage.verifyUrl(Paths.UI_PILOT);
    PilotEnvPage.verifyThreadLength(mockMessages);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('pilot OF inbox page view', () => {
    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage(mockFeatureToggles, Paths.UI_MAIN);

    PilotEnvPage.loadInboxMessages(0, Paths.UI_MAIN, mhvMessages);

    PilotEnvPage.verifyUrl(Paths.UI_MAIN);
    PilotEnvPage.verifyThreadLength(mhvMessages);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
