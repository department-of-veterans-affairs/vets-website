import featureFlagNames from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import searchSentFolderResponse from '../fixtures/searchResponses/search-sent-folder-response.json';
import mockRecipients from '../fixtures/recipientsResponse/recipients-response.json';

const RECENT_CARE_TEAMS_LABEL = 'Recent care teams';

/**
 * Select Care Team page recent recipients integration coverage.
 *
 * Scenarios:
 *  1. Recent care teams optgroup appears with up to 4 recent teams (no duplicates) when both
 *     curated list and recent recipients flags are enabled and recent results exist.
 *  2. Recent group suppressed when recent recipients feature flag disabled (curated flow still on).
 *  3. Recent group suppressed when recent recipients flag enabled but no recent recipients resolved.
 *
 * Strategy:
 *  - Use context blocks with beforeEach for shared login & baseline intercepts.
 *  - Use '@recentRecipients' (interstitial POST search) + '@recipients' (all recipients).
 *  - Derive expected recent names from fixture (suggestedNameDisplay || name).
 *  - Assert invariants: <=4, unique, not duplicated after group.
 */

describe('SM CURATED LIST - Select Care Team recent recipients integration', () => {
  const deriveRecentRecipientIds = response => {
    const seen = [];
    (response.data || []).forEach(msg => {
      const id = msg.attributes?.recipientId;
      if (id != null && !seen.includes(id)) {
        seen.push(id);
      }
    });
    return seen.slice(0, 4);
  };

  const mapIdsToNames = ids =>
    ids
      .map(id =>
        (mockRecipients.data || []).find(
          r => r.id === id || r.id === Number(id),
        ),
      )
      .filter(Boolean)
      .map(r => r.attributes?.suggestedNameDisplay || r.attributes?.name);

  // Open combo box: break chain after alias to satisfy lint rule on unsafe chaining.
  const openComboBox = () => {
    // Split shadow traversal and alias assignment into separate Cypress command chains
    // to satisfy lint rule about unsafe chaining after aliasing.
    cy.findByTestId('compose-recipient-combobox')
      .shadow()
      .then($root => {
        cy.wrap($root)
          .find('input')
          .as('comboInput');
      });

    cy.get('@comboInput').focus();
    cy.get('@comboInput').type('{downarrow}', { force: true });
    cy.get('@comboInput').type(' ', { force: true });
  };

  const closeComboBox = () => {
    cy.get('body').type('{esc}', { force: true });
  };

  const axeRules = {
    'aria-required-children': { enabled: false },
    'aria-allowed-attr': { enabled: false },
  };

  const axeCheckCombo = () => {
    cy.injectAxe();
    cy.axeCheck(AXE_CONTEXT, { rules: axeRules });
  };

  /**
   * Validate recent optgroup presence, ordering, and invariants.
   * We intentionally do not rely on disabled options; recent items are rendered
   * inside an optgroup with label="Recent care teams".
   */
  const assertRecentGroupSection = expectedRecentNames => {
    cy.findByTestId('compose-recipient-combobox')
      .shadow()
      .find('#options--list')
      .should('exist');

    cy.findByTestId('compose-recipient-combobox')
      .shadow()
      .find('#options--list li.usa-combo-box__list-option--group')
      .contains(RECENT_CARE_TEAMS_LABEL);

    cy.findByTestId('compose-recipient-combobox')
      .shadow()
      .find('#options--list')
      .find('li')
      .then($items => {
        const texts = [...$items].map(el => el.textContent.trim());

        const recentGroupIdx = texts.indexOf(RECENT_CARE_TEAMS_LABEL);
        expect(recentGroupIdx).to.be.greaterThan(-1);

        // After group label, next N entries are recent options
        const afterGroup = texts.slice(recentGroupIdx + 1);
        const recentSlice = afterGroup.slice(0, expectedRecentNames.length);
        expect(recentSlice).to.deep.equal(expectedRecentNames);

        // Ensure those names do not appear again later
        const remainder = afterGroup.slice(expectedRecentNames.length);
        expectedRecentNames.forEach(name => {
          expect(remainder.filter(t => t === name).length).to.equal(0);
        });

        const uniqueRecent = new Set(recentSlice);
        expect(uniqueRecent.size).to.equal(recentSlice.length);
        expect(recentSlice.length).to.be.at.most(4);

        // Ensure there is at least one additional group (system grouping) after recents
        // This verifies ordering: recent group should precede facility/system groups.
        const hasSystemGroup =
          remainder.findIndex(
            txt => txt !== '' && !expectedRecentNames.includes(txt),
          ) > -1;
        expect(hasSystemGroup).to.be.true;
      });
  };

  /**
   * Assert recent optgroup absent.
   */
  const assertNoRecentGroup = () => {
    cy.findByTestId('compose-recipient-combobox')
      .shadow()
      .find('#options--list li.usa-combo-box__list-option--group')
      .should($headers => {
        const labels = [...$headers].map(h => h.textContent.trim());
        expect(labels).to.not.include(RECENT_CARE_TEAMS_LABEL);
      });
  };

  context('Recent group visible with recent recipients available', () => {
    beforeEach(() => {
      const toggles = GeneralFunctionsPage.updateFeatureToggles([
        {
          name: featureFlagNames.mhvSecureMessagingCuratedListFlow,
          value: true,
        },
        {
          name: featureFlagNames.mhvSecureMessagingRecentRecipients,
          value: true,
        },
      ]);
      SecureMessagingSite.login(toggles);
      PatientInboxPage.loadInboxMessages();
    });

    it('renders Recent optgroup with recent teams first (no duplicates, <=4)', () => {
      PatientInboxPage.clickCreateNewMessage();
      PatientInterstitialPage.continueToRecentRecipients();
      GeneralFunctionsPage.verifyPageHeader('Recent care teams');

      cy.findByLabelText('A different care team').click();
      cy.findByTestId(
        Locators.RECENT_CARE_TEAMS_CONTINUE_BUTTON_DATA_TEST_ID,
      ).click();

      GeneralFunctionsPage.verifyPageHeader('Select care team');
      axeCheckCombo();

      cy.wait('@recipients');

      openComboBox();

      const expectedRecentNames = mapIdsToNames(
        deriveRecentRecipientIds(searchSentFolderResponse),
      );
      assertRecentGroupSection(expectedRecentNames);
      closeComboBox();

      axeCheckCombo();
      // Explicit direct call to satisfy lint rule requiring visible axeCheck in test body
      cy.axeCheck(AXE_CONTEXT, { rules: axeRules });
    });
  });

  context('Recent group suppressed when feature flag disabled', () => {
    beforeEach(() => {
      const toggles = GeneralFunctionsPage.updateFeatureToggles([
        {
          name: featureFlagNames.mhvSecureMessagingCuratedListFlow,
          value: true,
        },
        {
          name: featureFlagNames.mhvSecureMessagingRecentRecipients,
          value: false,
        },
      ]);
      SecureMessagingSite.login(toggles);
      PatientInboxPage.loadInboxMessages();
    });

    it('does not show Recent group when feature flag off', () => {
      PatientInboxPage.clickCreateNewMessage();
      PatientInterstitialPage.continueToRecentRecipients();
      // With the recent recipients feature disabled we should land directly on Select care team
      GeneralFunctionsPage.verifyPageHeader('Select care team');

      cy.wait('@recipients');
      openComboBox();
      assertNoRecentGroup();
      closeComboBox();
      axeCheckCombo();
      cy.axeCheck(AXE_CONTEXT, { rules: axeRules });
    });
  });

  context('Recent group suppressed when no recent recipients resolved', () => {
    beforeEach(() => {
      const toggles = GeneralFunctionsPage.updateFeatureToggles([
        {
          name: featureFlagNames.mhvSecureMessagingCuratedListFlow,
          value: true,
        },
        {
          name: featureFlagNames.mhvSecureMessagingRecentRecipients,
          value: true,
        },
      ]);
      SecureMessagingSite.login(toggles);
      PatientInboxPage.loadInboxMessages();
    });

    it('does not show Recent group when recent search yields zero recipients', () => {
      PatientInboxPage.clickCreateNewMessage();
      PatientInterstitialPage.continueToRecentRecipients({ data: [] });
      GeneralFunctionsPage.verifyPageHeader('Select care team');

      cy.wait('@recipients');
      openComboBox();
      assertNoRecentGroup();
      closeComboBox();
      axeCheckCombo();
      cy.axeCheck(AXE_CONTEXT, { rules: axeRules });
    });
  });

  it('renders at least one selectable care team option (sanity)', () => {
    const toggles = GeneralFunctionsPage.updateFeatureToggles([
      { name: featureFlagNames.mhvSecureMessagingCuratedListFlow, value: true },
      {
        name: featureFlagNames.mhvSecureMessagingRecentRecipients,
        value: true,
      },
    ]);
    SecureMessagingSite.login(toggles);
    PatientInboxPage.loadInboxMessages();

    PatientInboxPage.clickCreateNewMessage();
    PatientInterstitialPage.continueToRecentRecipients();
    GeneralFunctionsPage.verifyPageHeader('Recent care teams');
    cy.findByLabelText('A different care team').click();
    cy.findByTestId(
      Locators.RECENT_CARE_TEAMS_CONTINUE_BUTTON_DATA_TEST_ID,
    ).click();
    GeneralFunctionsPage.verifyPageHeader('Select care team');

    cy.wait('@recipients');
    openComboBox();

    cy.findByTestId('compose-recipient-combobox')
      .shadow()
      .find('#options--list')
      .find('li')
      .should('have.length.greaterThan', 0);

    closeComboBox();
    axeCheckCombo();
    cy.axeCheck(AXE_CONTEXT, { rules: axeRules });
  });
});
// newline added to satisfy lint end-of-file rule
