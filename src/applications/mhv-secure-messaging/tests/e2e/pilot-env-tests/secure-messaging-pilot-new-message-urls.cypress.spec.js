import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths, Data } from '../utils/constants';
import mockFeatureToggles from '../fixtures/toggles-response.json';
import PilotEnvPage from '../pages/PilotEnvPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import mockSentThreads from '../fixtures/sentResponse/sent-messages-response.json';

describe('SM PILOT NEW MESSAGE', () => {
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

  it('verify url by direct navigation', () => {
    SecureMessagingSite.login(mockPilotFeatureToggles);
    PilotEnvPage.loadInboxMessages();

    cy.intercept('GET', Paths.INTERCEPT.SENT_THREADS, mockSentThreads).as(
      'sentThreadsResponse',
    );

    cy.visit(`${Paths.UI_PILOT}/new-message/select-care-team`);
    GeneralFunctionsPage.verifyPageHeader(Data.HCS_SELECT);

    cy.visit(`${Paths.UI_PILOT}/new-message/start-message`);
    GeneralFunctionsPage.verifyPageHeader(Data.START_NEW_MSG);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
