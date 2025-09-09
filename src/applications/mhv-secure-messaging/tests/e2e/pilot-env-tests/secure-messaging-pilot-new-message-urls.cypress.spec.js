import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths } from '../utils/constants';
import PilotEnvPage from '../pages/PilotEnvPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientComposePage from '../pages/PatientComposePage';

describe('SM PILOT NEW MESSAGE', () => {
  const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
    {
      name: 'mhv_secure_messaging_curated_list_flow',
      value: true,
    },
  ]);

  it('redirects to interstitial page after direct navigation', () => {
    SecureMessagingSite.login(updatedFeatureToggles);
    PilotEnvPage.loadInboxMessages();

    cy.visit(`${Paths.UI_MAIN}/new-message/select-care-team`);
    GeneralFunctionsPage.verifyPageHeader(
      'Only use messages for non-urgent needs',
    );

    PatientComposePage.interceptSentFolder();

    cy.visit(`${Paths.UI_MAIN}/new-message/start-message`);
    GeneralFunctionsPage.verifyPageHeader(
      'Only use messages for non-urgent needs',
    );

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
