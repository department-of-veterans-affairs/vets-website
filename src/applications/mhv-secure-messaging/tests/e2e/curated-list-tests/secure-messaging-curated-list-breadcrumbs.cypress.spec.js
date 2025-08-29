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

    // Intercept sent threads to stabilize compose load
    cy.intercept('GET', Paths.INTERCEPT.SENT_THREADS, { data: [] }).as(
      'sentThreads',
    );

    cy.findByTestId('continue-button').click();
    cy.wait('@sentThreads');

    GeneralFunctionsPage.verifyPageHeader('Start message');
    cy.location('pathname').should(
      'include',
      `${Paths.COMPOSE.replace(/\/$/, '')}${Paths.START_MESSAGE}`,
    );
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    // Click back to select care team
    cy.findByTestId('sm-breadcrumbs-back').click();

    GeneralFunctionsPage.verifyPageHeader('Select care team');
    cy.location('pathname').should(
      'include',
      `${Paths.COMPOSE.replace(/\/$/, '')}${Paths.SELECT_CARE_TEAM}`,
    );

    // Click back to the interstitial page, which triggers a modal
    cy.findByTestId('sm-breadcrumbs-back').click();

    // Dismiss navigation warning modal
    cy.get(`va-button[text="Delete draft"]`).click();

    GeneralFunctionsPage.verifyPageHeader(
      'Only use messages for non-urgent needs',
    );
    cy.findByRole('button', { name: /Continue to start message/i }).click();
    GeneralFunctionsPage.verifyPageHeader('Select care team');
    cy.location('pathname').should(
      'include',
      `${Paths.COMPOSE.replace(/\/$/, '')}${Paths.SELECT_CARE_TEAM}`,
    );
  });

  it('can navigate to Care team help and back via breadcrumb', () => {
    // Start at Select care team page
    PilotEnvPage.navigateToSelectCareTeamPage();
    GeneralFunctionsPage.verifyPageHeader('Select care team');
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    // Navigate to Care team help page via link text
    cy.contains(/What to do if you can’t find your care team/i)
      .should('be.visible')
      .click();

    GeneralFunctionsPage.verifyPageHeader('Can’t find your care team?');
    cy.location('pathname').should('include', `${Paths.COMPOSE}care-team-help`);
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    // Use breadcrumb Back to return
    cy.findByTestId('sm-breadcrumbs-back').click();

    GeneralFunctionsPage.verifyPageHeader('Select care team');
    cy.location('pathname').should(
      'include',
      `${Paths.COMPOSE.replace(/\/$/, '')}${Paths.SELECT_CARE_TEAM}`,
    );
  });
});
