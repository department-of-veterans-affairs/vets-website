import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths, Data } from '../utils/constants';
import PilotEnvPage from '../pages/PilotEnvPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import mockSentThreads from '../fixtures/sentResponse/sent-messages-response.json';
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

    cy.intercept('GET', Paths.INTERCEPT.SENT_THREADS, mockSentThreads).as(
      'sentThreadsResponse',
    );

    cy.visit(`${Paths.UI_PILOT}/new-message/select-care-team`);
    GeneralFunctionsPage.verifyPageHeader(Data.HCS_SELECT);

    PatientComposePage.interceptSentFolder();

    cy.visit(`${Paths.UI_PILOT}/new-message/start-message`);
    GeneralFunctionsPage.verifyPageHeader('Start message');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
