import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths } from '../utils/constants';
import mockFeatureToggles from '../fixtures/toggles-response.json';
import SecureMessagingLandingPage from '../pages/SecureMessagingLandingPage';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PilotEnvPage from '../pages/PilotEnvPage';
import mockMessages from '../fixtures/pilot-responses/inbox-threads-OH-response.json';

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
  const filteredData = {
    data: mockMessages.data.filter(el => el.attributes.subject.includes('OH')),
  };
  const updatedMockMessages = GeneralFunctionsPage.updatedThreadDates(
    mockMessages,
  );

  beforeEach(() => {
    SecureMessagingSite.login();
    SecureMessagingLandingPage.loadMainPage(
      mockPilotFeatureToggles,
      Paths.UI_PILOT,
    );

    PilotEnvPage.loadInboxMessages(Paths.UI_PILOT, updatedMockMessages);
    PilotEnvPage.verifyUrl(Paths.UI_PILOT);
  });

  it('verify filter works correctly', () => {
    PilotEnvPage.inputFilterData(`OH`);

    PilotEnvPage.clickFilterButton(filteredData);

    PilotEnvPage.verifyFilterResults('OH', filteredData);

    cy.contains('Clear Filters').click({ force: true });

    PilotEnvPage.verifyThreadLength(updatedMockMessages);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });

  it('verify sorting works correctly', () => {
    const sortedResponse = {
      ...updatedMockMessages,
      data: [...updatedMockMessages.data].sort(
        (a, b) =>
          new Date(a.attributes.sentDate) - new Date(b.attributes.sentDate),
      ),
    };

    PilotEnvPage.verifySorting('Oldest to newest', sortedResponse);

    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT);
  });
});
