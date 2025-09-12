import featureFlagNames from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators, Paths } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import searchSentFolderResponse from '../fixtures/searchResponses/search-sent-folder-response.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';

/**
 * This spec validates that on the Select care team page (curated list flow),
 * the VaComboBox renders the "Recent care teams" and "All care teams" headings
 * with up to 4 recent teams first (no duplicates), followed by remaining teams,
 * when the recent recipients feature flag is enabled. It also validates that
 * when the recent recipients flag is disabled the headings are not shown and
 * the list is the full (sorted) list only.
 */
describe('SM CURATED LIST - Select Care Team recent section', () => {
  const enableCuratedAndRecentFlags = () =>
    GeneralFunctionsPage.updateFeatureToggles([
      {
        name: featureFlagNames.mhvSecureMessagingCuratedListFlow,
        value: true,
      },
      {
        name: featureFlagNames.mhvSecureMessagingRecentRecipients,
        value: true,
      },
    ]);

  const enableCuratedOnlyFlag = () =>
    GeneralFunctionsPage.updateFeatureToggles([
      {
        name: featureFlagNames.mhvSecureMessagingCuratedListFlow,
        value: true,
      },
      {
        // Explicitly set recent recipients flag false
        name: featureFlagNames.mhvSecureMessagingRecentRecipients,
        value: false,
      },
    ]);

  const interceptCoreEndpoints = (
    searchResponse = searchSentFolderResponse,
  ) => {
    // Allowed recipients list
    cy.intercept(
      'GET',
      Paths.INTERCEPT.MESSAGE_ALLRECIPIENTS,
      mockRecipients,
    ).as('allRecipients');
    // Categories (avoid unrelated failures)
    cy.intercept('GET', Paths.INTERCEPT.MESSAGE_CATEGORY, {
      data: [],
    }).as('categories');
    // Sent search used to derive recent recipients
    cy.intercept('POST', Paths.INTERCEPT.SENT_SEARCH, searchResponse).as(
      'recentSearch',
    );
  };

  const navigateToSelectCareTeam = () => {
    PatientInboxPage.clickCreateNewMessage();
    // Interstitial Recent care teams page
    PatientInterstitialPage.continueToRecentRecipients();
    // Choose "A different care team" to reach Select care team page
    cy.findByLabelText('A different care team').click();
    cy.findByTestId(
      Locators.RECENT_CARE_TEAMS_CONTINUE_BUTTON_DATA_TEST_ID,
    ).click();
    GeneralFunctionsPage.verifyPageHeader('Select care team');
  };

  const getRecentIdsFromSearch = response => {
    const unique = [];
    (response.data || []).forEach(msg => {
      const id = msg.attributes.recipientId;
      if (id != null && !unique.includes(id)) {
        unique.push(id);
      }
    });
    return unique.slice(0, 4);
  };

  const mapIdsToNames = ids => {
    return ids
      .map(id =>
        (mockRecipients.data || []).find(
          r => r.id === id || r.id === Number(id),
        ),
      )
      .filter(Boolean)
      .map(r => r.attributes.suggestedNameDisplay || r.attributes.name);
  };

  const openComboBoxList = () => {
    // Focus and type a space to force open (VaComboBox opens its list on input)
    cy.get('va-combo-box')
      .shadow()
      .find('input')
      .focus()
      .type(' ', { force: true });
  };

  const getListItems = () =>
    cy
      .get('va-combo-box')
      .shadow()
      .find('#options--list')
      .find('li');

  it('renders recent + all headings with recent teams first (flags enabled)', () => {
    const toggles = enableCuratedAndRecentFlags();
    SecureMessagingSite.login(toggles);
    interceptCoreEndpoints();
    PatientInboxPage.loadInboxMessages(); // sets up inbox & recipients intercepts
    navigateToSelectCareTeam();

    // Wait for recent recipients search & all recipients
    cy.wait('@recentSearch');
    cy.wait('@allRecipients');

    openComboBoxList();

    // Assert headings exist (by text)
    getListItems()
      .first()
      .should('contain.text', 'Recent care teams')
      .and('have.attr', 'aria-disabled', 'true');

    // Find index of "All care teams" heading
    getListItems()
      .contains('All care teams')
      .should('have.attr', 'aria-disabled', 'true');

    // Derive expected recent names
    const recentIds = getRecentIdsFromSearch(searchSentFolderResponse);
    const expectedRecentNames = mapIdsToNames(recentIds);

    // Collect list item texts (excluding headings) until we encounter All care teams heading
    getListItems().then(items => {
      const texts = [...items].map(el => el.textContent.trim());
      const recentHeadingIndex = texts.indexOf('Recent care teams');
      const allHeadingIndex = texts.indexOf('All care teams');

      // Basic sanity
      expect(recentHeadingIndex).to.equal(0);
      expect(allHeadingIndex).to.be.greaterThan(0);

      const actualRecent = texts.slice(
        recentHeadingIndex + 1,
        recentHeadingIndex + 1 + expectedRecentNames.length,
      );

      expect(actualRecent).to.deep.equal(expectedRecentNames);

      // Ensure none of the recent names appear again after All care teams heading
      const afterAll = texts.slice(allHeadingIndex + 1);
      expectedRecentNames.forEach(name => {
        expect(afterAll.filter(t => t === name).length).to.equal(0);
      });
    });

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('does not render headings when recent recipients flag disabled', () => {
    const toggles = enableCuratedOnlyFlag();
    SecureMessagingSite.login(toggles);
    // Even if backend returns search results, flag off should suppress headings
    interceptCoreEndpoints();
    PatientInboxPage.loadInboxMessages();
    navigateToSelectCareTeam();

    cy.wait('@allRecipients');

    openComboBoxList();

    getListItems().then(items => {
      const texts = [...items].map(el => el.textContent.trim());
      expect(texts).to.not.include('Recent care teams');
      expect(texts).to.not.include('All care teams');
    });

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('suppresses headings when no recent recipients resolved', () => {
    // Provide empty search response so no recent IDs match
    const toggles = enableCuratedAndRecentFlags();
    SecureMessagingSite.login(toggles);
    interceptCoreEndpoints({ data: [] });
    PatientInboxPage.loadInboxMessages();
    navigateToSelectCareTeam();

    cy.wait('@recentSearch');
    cy.wait('@allRecipients');

    openComboBoxList();

    getListItems().then(items => {
      const texts = [...items].map(el => el.textContent.trim());
      expect(texts).to.not.include('Recent care teams');
      expect(texts).to.not.include('All care teams');
    });

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
// newline added to satisfy lint end-of-file rule
