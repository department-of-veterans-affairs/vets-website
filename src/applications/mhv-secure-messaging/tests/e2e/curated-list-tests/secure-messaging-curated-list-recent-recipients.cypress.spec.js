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
  });

  it('verify recent recipients list with maximum recipients', () => {
    PilotEnvPage.navigateToRecentCareTeamsPage();

    GeneralFunctionsPage.verifyPageHeader(`Recent care teams`);

    cy.get(Locators.CARE_SYSTEM).should(`not.exist`);

    cy.get(`.usa-legend`).should('include.text', Data.RECENT_RECIPIENTS);

    PilotEnvPage.verifyRecentCareTeamsList();

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify recent recipients list with only one recipient', () => {
    const oneRecipientResponse = { data: [mockThreadsResponse.data[0]] };

    PilotEnvPage.navigateToRecentCareTeamsPage(oneRecipientResponse);

    GeneralFunctionsPage.verifyPageHeader(`Recent care teams`);

    cy.get(Locators.CARE_SYSTEM).should(`not.exist`);

    cy.get(`.usa-legend`).should('include.text', Data.RECENT_RECIPIENTS);

    cy.get(`va-radio-option`)
      .eq(0)
      .invoke(`attr`, `label`)
      .then(label => {
        expect(label).to.eq(
          oneRecipientResponse.data[0].attributes.triageGroupName,
        );
      });

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
