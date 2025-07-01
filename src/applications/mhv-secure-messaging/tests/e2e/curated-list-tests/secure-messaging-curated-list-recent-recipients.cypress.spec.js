import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators, Data } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PilotEnvPage from '../pages/PilotEnvPage';
import mockThreadsResponse from '../fixtures/pilot-responses/threads-recent-recipients-response.json';

describe('SM CURATED LIST MAIN FLOW', () => {
  beforeEach(() => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_cerner_pilot',
        value: true,
      },
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PilotEnvPage.loadInboxMessages();
    PilotEnvPage.navigateToRecentCareTeamsPage();
  });

  it('verify recent recipients list', () => {
    GeneralFunctionsPage.verifyPageHeader(`Recent care teams`);

    cy.get(Locators.CARE_SYSTEM).should(`not.exist`);

    cy.get(`.usa-legend`).should('include.text', Data.RECENT_RECIPIENTS);

    const TGList = mockThreadsResponse.data.map(
      item => item.attributes.triageGroupName,
    );
    TGList.push(`A different care team`);

    PilotEnvPage.verifyRecentCareTeamsList(TGList);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
