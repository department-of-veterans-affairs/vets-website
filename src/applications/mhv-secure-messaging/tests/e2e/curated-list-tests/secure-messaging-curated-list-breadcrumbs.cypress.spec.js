import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PilotEnvPage from '../pages/PilotEnvPage';

describe('SM CURATED LIST BREADCRUMBS', () => {
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

  it('can navigate back through the curated list flow', () => {
    // Navigate to the start of the flow
    PilotEnvPage.navigateToSelectCareTeamPage();
    GeneralFunctionsPage.verifyPageHeader('Select care team');
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    // Navigate to the compose page
    PilotEnvPage.selectCareSystem(0);
    PilotEnvPage.selectTriageGroup(2);
    cy.findByTestId('continue-button').click();
    cy.get(`va-button[secondary][text="Delete draft"]`).click();
    GeneralFunctionsPage.verifyPageHeader('Start message');
    cy.location('pathname').should(
      'include',
      `${Paths.COMPOSE}${Paths.START_MESSAGE}`,
    );
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    // Click back to select care team
    cy.findByTestId('sm-breadcrumbs-back').click();
    GeneralFunctionsPage.verifyPageHeader('Select care team');
    cy.location('pathname').should(
      'include',
      `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`,
    );

    // Click back to the interstitial page, which triggers a modal
    cy.findByTestId('sm-breadcrumbs-back').click();
    GeneralFunctionsPage.verifyPageHeader(
      'Only use messages for non-urgent needs',
    );
    cy.findByRole('button', { name: /Continue to start message/i }).click();
    GeneralFunctionsPage.verifyPageHeader('Select care team');
    cy.location('pathname').should(
      'include',
      `${Paths.COMPOSE}${Paths.SELECT_CARE_TEAM}`,
    );
  });
});
