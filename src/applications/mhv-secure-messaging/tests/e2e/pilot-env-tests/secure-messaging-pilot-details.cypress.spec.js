import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths } from '../utils/constants';
import SecureMessagingLandingPage from '../pages/SecureMessagingLandingPage';
import PilotEnvPage from '../pages/PilotEnvPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import mockMultiThreadResponse from '../fixtures/pilot-responses/multi-message-thread-response.json';

describe('Secure Messaging Pilot feature flag', () => {
  const currentDate = GeneralFunctionsPage.getDateFormat();
  const mockPilotFeatureToggles = GeneralFunctionsPage.updateFeatureToggles(
    'mhv_secure_messaging_cerner_pilot',
    true,
  );

  it('pilot ON inbox page view', () => {
    mockMultiThreadResponse.data[0].attributes.sentDate = currentDate;
    cy.log(currentDate);

    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage(
      mockPilotFeatureToggles,
      Paths.UI_PILOT,
    );

    PilotEnvPage.loadInboxMessages();

    PilotEnvPage.loadThread();

    PilotEnvPage.verifyUrl(Paths.UI_PILOT);

    PilotEnvPage.verifyHeader(
      mockMultiThreadResponse.data[0].attributes.subject,
    );

    PilotEnvPage.verifyMessageDetails(mockMultiThreadResponse, 0);

    PilotEnvPage.verifyButtons();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
