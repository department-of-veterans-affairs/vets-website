import featureFlagNames from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import SecureMessagingSite from '../sm_site/SecureMessagingSite';
import { AXE_CONTEXT, Locators } from '../utils/constants';
import GeneralFunctionsPage from '../pages/GeneralFunctionsPage';
import PatientInboxPage from '../pages/PatientInboxPage';
import PatientInterstitialPage from '../pages/PatientInterstitialPage';
import searchSentFolderResponse from '../fixtures/searchResponses/search-sent-folder-response.json';
import recipientsResponse from '../fixtures/recipientsResponse/recipients-response.json';

/**
 * WCAG 1.4.10 Reflow accessibility test
 * Tests that va-radio-option elements don't overflow at high zoom levels
 * See: https://github.com/department-of-veterans-affairs/va.gov-team/issues/119851
 *
 * At 400% zoom with 1280px viewport, effective CSS width is 320px (1280 / 4)
 * This test simulates that by setting viewport to 320px width
 */
describe('SM WCAG 1.4.10 Reflow - Recent Care Teams', () => {
  // Create modified recipients with a very long team name to prove wrapping works
  const longTeamName =
    'Release of Information and Medical Records Administration Team - Primary Care Clinic';

  const getModifiedRecipients = () => {
    const modified = JSON.parse(JSON.stringify(recipientsResponse));
    // Replace first team name with a very long name
    modified.data[0].attributes.name = longTeamName;
    modified.data[0].attributes.healthCareSystemName =
      'VA Greater Los Angeles Healthcare System';
    return modified;
  };

  const getModifiedSearchResponse = () => {
    const modified = JSON.parse(JSON.stringify(searchSentFolderResponse));
    // Update the search response to match the long team name
    modified.data[0].attributes.recipientName = longTeamName;
    modified.data[0].attributes.triageGroupName = longTeamName;
    return modified;
  };

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
    // Load inbox with modified recipients that have long team names
    PatientInboxPage.loadInboxMessages(
      undefined,
      undefined,
      getModifiedRecipients(),
    );
  });

  it('va-radio-options should not overflow viewport at 320px width (simulates 1280px @ 400% zoom)', () => {
    // Set viewport to 320px width - equivalent to 1280px at 400% zoom
    // WCAG 1.4.10 requires content to reflow at 320 CSS pixels width
    // Use taller height to capture more content
    cy.viewport(320, 900);

    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/-1/search*',
      getModifiedSearchResponse(),
    ).as('recentRecipients');

    PatientInboxPage.clickCreateNewMessage();
    cy.wait('@recentRecipients');

    // Wait for href to be /recent before clicking to avoid race condition
    PatientInterstitialPage.getStartMessageLink()
      .should('have.attr', 'href')
      .and('include', '/recent');

    PatientInterstitialPage.getStartMessageLink().click();

    // Verify the page loaded correctly
    cy.findByTestId(Locators.RECENT_CARE_TEAMS_RADIO_GROUP_TEST_ID).should(
      'exist',
    );

    // Wait for radio options to be visible before screenshot
    cy.get('va-radio-option').should('have.length.at.least', 1);

    // Scroll the radio group into view centered in viewport
    cy.get('va-radio').scrollIntoView({ offset: { top: -50, left: 0 } });

    // Check that va-radio-option elements don't overflow the viewport
    // The element's right edge should not exceed the viewport width
    cy.get('va-radio-option').each($radioOption => {
      cy.wrap($radioOption).then($el => {
        const rect = $el[0].getBoundingClientRect();
        // Element should be fully contained within viewport (320px)
        // Allow small tolerance for borders/shadows
        expect(rect.right).to.be.lessThan(
          325,
          'va-radio-option should not extend past viewport edge',
        );
      });
    });

    // Also verify no horizontal scroll is needed
    cy.window().then(win => {
      expect(win.document.documentElement.scrollWidth).to.be.at.most(
        win.document.documentElement.clientWidth,
        'Page should not have horizontal overflow',
      );
    });

    // Run axe accessibility checks at this viewport size
    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });

  it('va-radio-options should display correctly at normal viewport sizes', () => {
    // Test at normal desktop width to ensure no regression
    cy.viewport(1280, 800);

    cy.intercept(
      'POST',
      '/my_health/v1/messaging/folders/-1/search*',
      getModifiedSearchResponse(),
    ).as('recentRecipients');

    PatientInboxPage.clickCreateNewMessage();
    cy.wait('@recentRecipients');

    // Wait for href to be /recent before clicking to avoid race condition
    PatientInterstitialPage.getStartMessageLink()
      .should('have.attr', 'href')
      .and('include', '/recent');

    PatientInterstitialPage.getStartMessageLink().click();

    // Verify the page loaded
    cy.findByTestId(Locators.RECENT_CARE_TEAMS_RADIO_GROUP_TEST_ID).should(
      'exist',
    );

    // Wait for radio options to be visible
    cy.get('va-radio-option').should('have.length.at.least', 1);

    // At normal width, elements should definitely not overflow
    cy.get('va-radio-option').each($radioOption => {
      cy.wrap($radioOption).then($el => {
        const rect = $el[0].getBoundingClientRect();
        expect(rect.right).to.be.lessThan(
          1285,
          'va-radio-option should not extend past viewport edge',
        );
      });
    });

    cy.injectAxeThenAxeCheck(AXE_CONTEXT);
  });
});
