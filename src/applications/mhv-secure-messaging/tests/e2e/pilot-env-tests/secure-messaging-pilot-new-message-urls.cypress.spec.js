import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths, Data } from '../utils/constants';
import PilotEnvPage from '../pages/PilotEnvPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientComposePage from '../pages/PatientComposePage';

describe('SM PILOT NEW MESSAGE', () => {
  const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
    {
      name: 'mhv_secure_messaging_cerner_pilot',
      value: true,
    },
  ]);

  it('verify url by direct navigation', () => {
    SecureMessagingSite.login(updatedFeatureToggles);
    PilotEnvPage.loadInboxMessages();

    cy.visit(`${Paths.UI_MAIN}/new-message/select-care-team`);
    GeneralFunctionsPage.verifyPageHeader(Data.HCS_SELECT);

    PatientComposePage.interceptSentFolder();

    cy.visit(`${Paths.UI_MAIN}/new-message/start-message`);
    GeneralFunctionsPage.verifyPageHeader('Start message');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
