import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths, Data } from '../utils/constants';
import mockFeatureToggles from '../fixtures/toggles-response.json';
import PilotEnvPage from '../pages/PilotEnvPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientComposePage from '../pages/PatientComposePage';

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

    cy.visit(`${Paths.UI_PILOT}/new-message/select-care-team`);
    GeneralFunctionsPage.verifyPageHeader(Data.HCS_SELECT);

    PatientComposePage.interceptSentFolder();

    cy.visit(`${Paths.UI_PILOT}/new-message/start-message`);
    GeneralFunctionsPage.verifyPageHeader('Start message');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
