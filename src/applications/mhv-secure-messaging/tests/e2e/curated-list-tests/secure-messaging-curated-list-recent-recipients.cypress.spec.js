import featureFlagNames from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators, Data, Paths } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import searchSentFolderResponse from '../fixtures/searchResponses/search-sent-folder-response.json';

describe('SM CURATED LIST MAIN FLOW WITH RECENT RECIPIENTS', () => {
  beforeEach(() => {
    const updatedFeatureToggles = GeneralFunctionsPage.updateFeatureToggles([
      {
        name: featureFlagNames.mhvSecureMessagingRecentRecipients,
        value: true,
      },
      {
        name: featureFlagNames.mhvSecureMessagingCuratedListFlow,
        value: true,
      },
    ]);
    SecureMessagingSite.login(updatedFeatureToggles);
    PatientInboxPage.loadInboxMessages();
  });

  const clickContinueOnInterstitial = href => {
    PatientInterstitialPage.getStartMessageLink()
      .should('have.attr', 'href')
      .and('contain', href);
    PatientInterstitialPage.getStartMessageLink().click();
  };

  const recentCareTeams = [
    '###ABC_XYZ_TRIAGE_TEAM###',
    'TG-7410',
    '***TG 100_SLC4%',
    '***TG 200_APPT_SLC4%',
  ];

  it('verify recent recipients list with maximum recipients', () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/-1/search*',
      searchSentFolderResponse,
    ).as('recentRecipients');
    PatientInboxPage.clickCreateNewMessage();
    cy.wait('@recentRecipients');
    clickContinueOnInterstitial(Paths.RECENT_CARE_TEAMS);
    GeneralFunctionsPage.verifyPageHeader(Data.RECENT_RECIPIENTS_HEADER);
    GeneralFunctionsPage.verifyPageTitle(
      'Recently Messaged Care Teams - Start Message | Veterans Affairs',
    );

    cy.findByTestId(Locators.EMERGENCY_USE_EXPANDABLE_DATA_TEST_ID).should(
      `exist`,
    );

    cy.findByTestId(Locators.RECENT_CARE_TEAMS_RADIO_GROUP_TEST_ID).should(
      `have.attr`,
      `label`,
      Data.RECENT_RECIPIENTS_LABEL,
    );

    recentCareTeams.forEach(careTeam => {
      cy.findByText(careTeam).should('exist');
    });
    cy.findByText('CAMRY_PCMM RELATIONSHIP_05092022_SLC4%').should('not.exist');
    cy.findByText('A different care team').should('exist');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('verify recent recipients list with less than maximum recipients', () => {
    const modifiedSearchResponse = { ...searchSentFolderResponse };
    // keep only 2 unique triage groups in the response
    modifiedSearchResponse.data = modifiedSearchResponse.data.filter(
      item =>
        item.attributes.recipientName === '###ABC_XYZ_TRIAGE_TEAM###' ||
        item.attributes.recipientName === 'TG-7410',
    );
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/-1/search*',
      modifiedSearchResponse,
    ).as('recentRecipients');
    PatientInboxPage.clickCreateNewMessage();
    cy.wait('@recentRecipients');
    clickContinueOnInterstitial(Paths.RECENT_CARE_TEAMS);
    GeneralFunctionsPage.verifyPageHeader(Data.RECENT_RECIPIENTS_HEADER);

    cy.findByTestId(Locators.EMERGENCY_USE_EXPANDABLE_DATA_TEST_ID).should(
      `exist`,
    );

    cy.findByTestId(Locators.RECENT_CARE_TEAMS_RADIO_GROUP_TEST_ID).should(
      `have.attr`,
      `label`,
      Data.RECENT_RECIPIENTS_LABEL,
    );

    ['###ABC_XYZ_TRIAGE_TEAM###', 'TG-7410'].forEach(careTeam => {
      cy.findByText(careTeam).should('exist');
    });
    // validate that other care teams do not exist
    ['***TG 100_SLC4%', '***TG 200_APPT_SLC4%'].forEach(careTeam => {
      cy.findByText(careTeam).should('not.exist');
    });
    cy.findByText('A different care team').should('exist');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('validate selection error', () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/-1/search*',
      searchSentFolderResponse,
    ).as('recentRecipients');
    PatientInboxPage.clickCreateNewMessage();
    cy.wait('@recentRecipients');
    clickContinueOnInterstitial(Paths.RECENT_CARE_TEAMS);
    GeneralFunctionsPage.verifyPageHeader(Data.RECENT_RECIPIENTS_HEADER);

    cy.findByLabelText(`${recentCareTeams[0]}VA Madison health care`).should(
      'be.visible',
    );
    cy.findByTestId(
      Locators.RECENT_CARE_TEAMS_CONTINUE_BUTTON_DATA_TEST_ID,
    ).click();

    // Wait for error message to appear and be visible
    cy.findByTestId(Locators.RECENT_CARE_TEAMS_RADIO_GROUP_TEST_ID)
      .shadow()
      .findByText('Select a care team')
      .should('be.visible');

    // Validate the first va-radio-option receives focus after the intentional 18-second delay
    // This timeout allows screen readers to complete reading the full label, hint text, and error message
    // Use extended timeout to accommodate the accessibility timing requirement
    cy.findByLabelText(`${recentCareTeams[0]}VA Madison health care`, {
      timeout: 20000,
    }).should('have.focus');
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('validate selecting different care team option', () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/-1/search*',
      searchSentFolderResponse,
    ).as('recentRecipients');
    PatientInboxPage.clickCreateNewMessage();
    cy.wait('@recentRecipients');
    clickContinueOnInterstitial(Paths.RECENT_CARE_TEAMS);
    GeneralFunctionsPage.verifyPageHeader(Data.RECENT_RECIPIENTS_HEADER);

    cy.findByLabelText('A different care team').click();

    cy.findByTestId(
      Locators.RECENT_CARE_TEAMS_CONTINUE_BUTTON_DATA_TEST_ID,
    ).click();

    GeneralFunctionsPage.verifyPageHeader(`Select care team`);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('validate redirecting to Select Care Team page when no recent recipients available', () => {
    const modifiedSearchResponse = { data: [] };
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/-1/search*',
      modifiedSearchResponse,
    ).as('recentRecipients');
    PatientInboxPage.clickCreateNewMessage();
    cy.wait('@recentRecipients');
    clickContinueOnInterstitial(Paths.SELECT_CARE_TEAM);
    GeneralFunctionsPage.verifyPageHeader(`Select care team`);

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('validate selecting a recent care team and continuing to compose message', () => {
    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/-1/search*',
      searchSentFolderResponse,
    ).as('recentRecipients');
    PatientInboxPage.clickCreateNewMessage();
    cy.wait('@recentRecipients');
    clickContinueOnInterstitial(Paths.RECENT_CARE_TEAMS);
    GeneralFunctionsPage.verifyPageHeader(Data.RECENT_RECIPIENTS_HEADER);

    // Select the first recent care team
    cy.get(`[label="${recentCareTeams[0]}"]`).click();

    cy.findByTestId(
      Locators.RECENT_CARE_TEAMS_CONTINUE_BUTTON_DATA_TEST_ID,
    ).click();

    GeneralFunctionsPage.verifyPageHeader('Start message');

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
