import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths } from '../utils/constants';
import mockFeatureToggles from '../fixtures/toggles-response.json';
import SecureMessagingLandingPage from '../pages/SecureMessagingLandingPage';
import PilotEnvPage from '../pages/PilotEnvPage';
import mockSingleThread from '../fixtures/pilot-responses/single-message-thread-response.json';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';

describe('Secure Messaging Pilot feature flag', () => {
  const currentDate = GeneralFunctionsPage.getDateFormat();
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
    PilotEnvPage.loadSingleThread();

    PilotEnvPage.verifyUrl(Paths.UI_PILOT);

    PilotEnvPage.verifyHeader(mockSingleThread.data[0].attributes.subject);

    PilotEnvPage.verifyMessageDetails(currentDate, 0);

    PilotEnvPage.verifyButtons();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
