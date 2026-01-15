import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Paths, Data, Locators } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PilotEnvPage from '../pages/PilotEnvPage';
import SharedComponents from '../pages/SharedComponents';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import mockSentFolderMetadata from '../fixtures/sentResponse/folder-sent-metadata.json';
import mockFolders from '../fixtures/folder-response.json';
import searchSentFolderResponse from '../fixtures/searchResponses/search-sent-folder-response.json';

describe('SM CURATED LIST BREADCRUMBS', () => {
  beforeEach(() => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_cerner_pilot',
        value: true,
      },
      {
        name: 'mhv_secure_messaging_curated_list_flow',
        value: true,
      },
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PilotEnvPage.loadInboxMessages();
  });

  describe('Basic flow navigation', () => {
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

      cy.findByTestId(Locators.INTERSTITIAL_CONTINUE_BUTTON).click();
      cy.wait('@sentThreads');

      GeneralFunctionsPage.verifyPageHeader('Start message');
      cy.location('pathname').should(
        'equal',
        `${Paths.UI_MAIN}${Paths.COMPOSE.replace(/\/$/, '')}${
          Paths.START_MESSAGE
        }/`,
      );
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);

      // Click back to select care team
      SharedComponents.clickBackBreadcrumb();

      GeneralFunctionsPage.verifyPageHeader('Select care team');
      cy.location('pathname').should('equal', Data.LINKS.SELECT_CARE_TEAM);

      SharedComponents.clickBackBreadcrumb();

      GeneralFunctionsPage.verifyPageHeader(
        'Only use messages for non-urgent needs',
      );

      cy.findByTestId('start-message-link').click();
      GeneralFunctionsPage.verifyPageHeader('Select care team');
      cy.location('pathname').should(
        'include',
        `${Paths.COMPOSE.replace(/\/$/, '')}${Paths.SELECT_CARE_TEAM}`,
      );
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);

      // Navigate to Care team help page via link
      cy.findByRole('link', {
        name: Data.CURATED_LIST.CANT_FIND_TEAM_LINK,
      }).click();

      // Removed the "Can't" in verifyPageHeader for testing purposes
      GeneralFunctionsPage.verifyPageHeader('find your care team?');
      GeneralFunctionsPage.verifyPageTitle(
        'Care Team Help - Start Message | Veterans Affairs',
      );
      cy.location('pathname').should('equal', Data.LINKS.CARE_TEAM_HELP);
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);

      SharedComponents.clickBackBreadcrumb();

      GeneralFunctionsPage.verifyPageHeader('Select care team');
      cy.location('pathname').should('equal', Data.LINKS.SELECT_CARE_TEAM);
    });

    it('navigates from select care team to contact list page and back', () => {
      // Navigate to select care team page
      PilotEnvPage.navigateToSelectCareTeamPage();
      GeneralFunctionsPage.verifyPageHeader('Select care team');
      cy.location('pathname').should('equal', Data.LINKS.SELECT_CARE_TEAM);

      // Click "Update your contact list" link
      cy.findByText('Update your contact list').click();

      // Verify contact list page loads
      GeneralFunctionsPage.verifyPageHeader('Messages: Contact list');
      cy.location('pathname').should('equal', Data.LINKS.CONTACT_LIST);
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);

      // Click back button
      SharedComponents.clickBackBreadcrumb();

      // Verify return to select care team page
      GeneralFunctionsPage.verifyPageHeader('Select care team');
      cy.location('pathname').should('equal', Data.LINKS.SELECT_CARE_TEAM);
    });
  });

  describe('Entry point preservation', () => {
    it('returns to Inbox after clicking back from interstitial page', () => {
      // User starts from Inbox (default load)
      cy.location('pathname').should('equal', `${Paths.UI_MAIN}${Paths.INBOX}`);

      // Click new message to go to interstitial
      cy.findByTestId(Locators.LINKS.CREATE_NEW_MESSAGE_DATA_TEST_ID).click();
      GeneralFunctionsPage.verifyPageHeader(
        'Only use messages for non-urgent needs',
      );
      cy.location('pathname').should(
        'equal',
        `${Paths.UI_MAIN}${Paths.COMPOSE}`,
      );
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);

      // Verify sessionStorage captured the entry point
      cy.window().then(win => {
        expect(win.sessionStorage.getItem('sm_composeEntryUrl')).to.equal(
          Paths.INBOX,
        );
      });

      // Click back from interstitial
      SharedComponents.clickBackBreadcrumb();

      // Should return to Inbox
      cy.location('pathname').should('equal', `${Paths.UI_MAIN}${Paths.INBOX}`);
      GeneralFunctionsPage.verifyPageHeader('Inbox');
    });

    it('returns to entry folder (Sent or Folders) after clicking back from interstitial page', () => {
      // Test for Sent folder
      cy.intercept('GET', `${Paths.SM_API_BASE + Paths.FOLDERS}/-1/threads*`, {
        data: [],
      }).as('sentMessages');
      cy.intercept(
        'GET',
        `${Paths.SM_API_BASE + Paths.FOLDERS}/-1*`,
        mockSentFolderMetadata,
      ).as('sentFolderMetadata');

      // Navigate to Sent folder
      cy.visit(`${Paths.UI_MAIN}${Paths.SENT}`);
      cy.wait('@sentMessages');
      cy.location('pathname').should('equal', `${Paths.UI_MAIN}${Paths.SENT}`);
      GeneralFunctionsPage.verifyPageHeader('Sent');

      // Click new message from Sent folder
      cy.findByTestId(Locators.LINKS.CREATE_NEW_MESSAGE_DATA_TEST_ID).click();
      GeneralFunctionsPage.verifyPageHeader(
        'Only use messages for non-urgent needs',
      );

      // Verify sessionStorage captured Sent as entry point
      cy.window().then(win => {
        expect(win.sessionStorage.getItem('sm_composeEntryUrl')).to.equal(
          Paths.SENT,
        );
      });

      // Click back from interstitial
      SharedComponents.clickBackBreadcrumb();

      // Should return to Sent folder
      cy.location('pathname').should('equal', `${Paths.UI_MAIN}${Paths.SENT}`);
      GeneralFunctionsPage.verifyPageHeader('Sent');
      cy.injectAxeThenAxeCheck(AXE_CONTEXT);

      // Test for Folders page
      cy.intercept(
        'GET',
        `${Paths.SM_API_BASE + Paths.FOLDERS}*`,
        mockFolders,
      ).as('folders');

      // Navigate to Folders page
      cy.visit(`${Paths.UI_MAIN}/folders/`);
      cy.wait('@folders');
      cy.location('pathname').should('equal', `${Paths.UI_MAIN}/folders/`);
      GeneralFunctionsPage.verifyPageHeader('More folders');

      // Click new message from Folders page
      cy.findByTestId(Locators.LINKS.CREATE_NEW_MESSAGE_DATA_TEST_ID).click();
      GeneralFunctionsPage.verifyPageHeader(
        'Only use messages for non-urgent needs',
      );

      // Verify sessionStorage captured Folders as entry point
      cy.window().then(win => {
        expect(win.sessionStorage.getItem('sm_composeEntryUrl')).to.equal(
          '/folders/',
        );
      });

      // Click back from interstitial
      SharedComponents.clickBackBreadcrumb();

      // Should return to Folders page
      cy.location('pathname').should('equal', `${Paths.UI_MAIN}/folders/`);
      GeneralFunctionsPage.verifyPageHeader('More folders');
    });
  });
});

describe('Recent care teams', () => {
  beforeEach(() => {
    // Enable recent recipients feature toggle
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: 'mhv_secure_messaging_cerner_pilot',
        value: true,
      },
      {
        name: 'mhv_secure_messaging_curated_list_flow',
        value: true,
      },
      {
        name: 'mhv_secure_messaging_recent_recipients',
        value: true,
      },
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PilotEnvPage.loadInboxMessages();
  });

  it('navigates full flow with recent care teams and returns to entry folder', () => {
    // Start from Sent folder
    cy.intercept('GET', `${Paths.SM_API_BASE + Paths.FOLDERS}/-1/threads*`, {
      data: [],
    }).as('sentMessages');
    cy.intercept(
      'GET',
      `${Paths.SM_API_BASE + Paths.FOLDERS}/-1*`,
      mockSentFolderMetadata,
    ).as('sentFolderMetadata');

    cy.visit(`${Paths.UI_MAIN}${Paths.SENT}`);
    cy.wait('@sentMessages');
    GeneralFunctionsPage.verifyPageHeader('Sent');

    // Set up intercept for recent recipients search
    // (this happens when interstitial page loads)
    cy.intercept(
      'POST',
      Paths.INTERCEPT.SENT_SEARCH,
      searchSentFolderResponse,
    ).as('recentRecipients');

    // Start new message from Sent folder
    cy.findByTestId(Locators.LINKS.CREATE_NEW_MESSAGE_DATA_TEST_ID).click();
    GeneralFunctionsPage.verifyPageHeader(
      'Only use messages for non-urgent needs',
    );

    // Wait for recent recipients to load
    cy.wait('@recentRecipients');
    PatientInterstitialPage.getStartMessageLink()
      .should('have.attr', 'href')
      .and('include', Paths.RECENT_CARE_TEAMS);
    PatientInterstitialPage.getStartMessageLink().click();
    GeneralFunctionsPage.verifyPageHeader(Data.RECENT_RECIPIENTS_HEADER);

    // Navigate forward to select care team
    cy.findByLabelText('A different care team').click();
    cy.findByTestId('recent-care-teams-continue-button').click();
    GeneralFunctionsPage.verifyPageHeader('Select care team');

    // Navigate back through the flow
    SharedComponents.clickBackBreadcrumb();
    GeneralFunctionsPage.verifyPageHeader(Data.RECENT_RECIPIENTS_HEADER);

    SharedComponents.clickBackBreadcrumb();
    GeneralFunctionsPage.verifyPageHeader(
      'Only use messages for non-urgent needs',
    );

    SharedComponents.clickBackBreadcrumb();

    // Should return to Sent folder (the entry point)
    cy.location('pathname').should('equal', `${Paths.UI_MAIN}${Paths.SENT}`);
    GeneralFunctionsPage.verifyPageHeader('Sent');
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('completes forward and backward navigation through entire curated flow', () => {
    // Start from Inbox
    cy.location('pathname').should('equal', `${Paths.UI_MAIN}${Paths.INBOX}`);

    // Set up intercept for recent recipients search BEFORE navigating
    cy.intercept(
      'POST',
      Paths.INTERCEPT.SENT_SEARCH,
      searchSentFolderResponse,
    ).as('recentRecipients');

    // Forward: Inbox → Interstitial
    cy.findByTestId(Locators.LINKS.CREATE_NEW_MESSAGE_DATA_TEST_ID).click();
    GeneralFunctionsPage.verifyPageHeader(
      'Only use messages for non-urgent needs',
    );
    cy.location('pathname').should('equal', `${Paths.UI_MAIN}${Paths.COMPOSE}`);

    // Wait for recent recipients to load before clicking continue
    cy.wait('@recentRecipients');

    // Ensure the link href is updated to point to recent care teams
    cy.get('[data-testid="start-message-link"]')
      .should('have.attr', 'href')
      .and('include', Paths.RECENT_CARE_TEAMS);

    // Forward: Interstitial → Recent care teams
    PatientInterstitialPage.getStartMessageLink().click();
    GeneralFunctionsPage.verifyPageHeader(Data.RECENT_RECIPIENTS_HEADER);
    cy.location('pathname').should(
      'equal',
      `${Paths.UI_MAIN}${Paths.COMPOSE}${Paths.RECENT_CARE_TEAMS}`,
    );

    // Forward: Recent care teams → Select care team
    cy.findByLabelText('A different care team').click();
    cy.findByTestId('recent-care-teams-continue-button').click();
    GeneralFunctionsPage.verifyPageHeader('Select care team');
    cy.location('pathname').should('equal', Data.LINKS.SELECT_CARE_TEAM);

    // Forward: Select care team → Start message
    PilotEnvPage.selectCareSystem(0);
    PilotEnvPage.selectTriageGroup(2);
    cy.intercept('GET', Paths.INTERCEPT.SENT_THREADS, { data: [] }).as(
      'sentThreads',
    );
    cy.findByTestId('continue-button').click();
    cy.wait('@sentThreads');
    GeneralFunctionsPage.verifyPageHeader('Start message');
    cy.location('pathname').should(
      'equal',
      `${Paths.UI_MAIN}${Paths.COMPOSE.replace(/\/$/, '')}${
        Paths.START_MESSAGE
      }/`,
    );
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);

    // Backward: Start message → Select care team
    SharedComponents.clickBackBreadcrumb();
    GeneralFunctionsPage.verifyPageHeader('Select care team');
    cy.location('pathname').should('equal', Data.LINKS.SELECT_CARE_TEAM);

    // Backward: Select care team → Recent care teams
    SharedComponents.clickBackBreadcrumb();
    GeneralFunctionsPage.verifyPageHeader(Data.RECENT_RECIPIENTS_HEADER);
    cy.location('pathname').should(
      'equal',
      `${Paths.UI_MAIN}${Paths.COMPOSE}${Paths.RECENT_CARE_TEAMS}`,
    );

    // Backward: Recent care teams → Interstitial
    SharedComponents.clickBackBreadcrumb();
    GeneralFunctionsPage.verifyPageHeader(
      'Only use messages for non-urgent needs',
    );
    cy.location('pathname').should('equal', `${Paths.UI_MAIN}${Paths.COMPOSE}`);

    // Backward: Interstitial → Inbox (entry point)
    SharedComponents.clickBackBreadcrumb();
    cy.location('pathname').should('equal', `${Paths.UI_MAIN}${Paths.INBOX}`);
    GeneralFunctionsPage.verifyPageHeader('Inbox');
  });
});
