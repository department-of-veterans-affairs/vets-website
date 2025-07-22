import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths } from '../utils/constants';
import PilotEnvPage from '../pages/PilotEnvPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import mockMultiThreadResponse from '../fixtures/pilot-responses/multi-message-thread-response.json';

describe('Secure Messaging Pilot feature flag', () => {
  const currentDate = GeneralFunctionsPage.getDateFormat();
  const mockPilotFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
    {
      name: 'mhv_secure_messaging_cerner_pilot',
      value: true,
    },
  ]);

  it('pilot ON inbox page view', () => {
    mockMultiThreadResponse.data[0].attributes.sentDate = currentDate;
    cy.log(currentDate);

    SecureMessagingSite.login(mockPilotFeatureToggles);

    PilotEnvPage.loadInboxMessages();

    PilotEnvPage.loadThread();

    PilotEnvPage.verifyUrl(Paths.UI_MAIN);

    PilotEnvPage.verifyHeader(
      mockMultiThreadResponse.data[0].attributes.subject,
    );

    PilotEnvPage.verifyMessageDetails(mockMultiThreadResponse, 0);

    PilotEnvPage.verifyButtons();

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
