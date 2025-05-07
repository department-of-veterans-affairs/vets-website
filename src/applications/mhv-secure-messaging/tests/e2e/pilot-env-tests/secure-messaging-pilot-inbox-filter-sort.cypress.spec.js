import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PilotEnvPage from '../pages/PilotEnvPage';
import PatientFilterPage from '../pages/PatientFilterPage';
import mockMessages from '../fixtures/pilot-responses/inbox-threads-OH-response.json';

describe('Secure Messaging Pilot feature flag', () => {
  const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
    {
      name: 'mhv_secure_messaging_cerner_pilot',
      value: true,
    },
  ]);

  const filterData = `OH`;
  const filteredResponse = PatientFilterPage.filterMockResponse(
    mockMessages,
    filterData,
  );

  beforeEach(() => {
    SecureMessagingSite.login(updatedFeatureToggles);

    PilotEnvPage.loadInboxMessages(Paths.UI_PILOT, mockMessages);
    PilotEnvPage.verifyUrl(Paths.UI_PILOT);
  });

  it('verify filter works correctly', () => {
    PilotEnvPage.inputFilterData(filterData);

    PilotEnvPage.clickFilterButton(filteredResponse);

    PilotEnvPage.verifyFilterResults(filterData, filteredResponse);

    cy.contains('Clear filters').click({ force: true });

    PilotEnvPage.verifyThreadLength(mockMessages);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify sorting works correctly', () => {
    const sortedResponse = PatientFilterPage.sortMessagesThread(mockMessages);

    PilotEnvPage.verifySorting('Oldest to newest', sortedResponse);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
