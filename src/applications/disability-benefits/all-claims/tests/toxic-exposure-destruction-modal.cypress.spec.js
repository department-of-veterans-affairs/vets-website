import path from 'path';

import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockLocations from './fixtures/mocks/separation-locations.json';
import mockPayment from './fixtures/mocks/payment-information.json';
import mockServiceBranches from './fixtures/mocks/service-branches.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import mockUpload from './fixtures/mocks/document-upload.json';
import mockUser from './fixtures/mocks/user.json';

import { mockItf } from './cypress.helpers';

// Import navigation helpers
import {
  clickContinue,
  navigateThroughPages,
  skipWizard,
  startApplication,
  waitForPageNavigation,
} from './cypress-rtl-helpers/navigation';

// Import form interaction helpers
import {
  fillConditionFollowUp,
  fillServicePeriod,
  selectNo,
  selectYes,
} from './cypress-rtl-helpers/form-interactions';

// Import VA component helpers
import {
  clickModalButton,
  interactWithVAComponent,
  verifyAlert,
  verifyModalContent,
  verifyModalVisibility,
  verifyVACheckboxState,
} from './cypress-rtl-helpers/components';

// Import disability-specific helpers
import { addDisabilityCondition } from './cypress-rtl-helpers/disability-helpers';

// Import mocking helpers
import { setupStandardMocks } from './cypress-rtl-helpers/mocking';

import {
  FORM_STATUS_BDD,
  MOCK_SIPS_API,
  SHOW_8940_4192,
  WIZARD_STATUS,
} from '../constants';

/**
 * @fileoverview E2E test suite for the Toxic Exposure Destruction Modal feature
 * @module toxic-exposure-destruction-modal.cypress.spec
 *
 * This test suite validates the toxic exposure destruction modal functionality that
 * warns users when they're about to delete previously entered toxic exposure data.
 * The modal appears when users select "none" after having selected conditions.
 *
 * Tests use React Testing Library patterns through custom helper functions for
 * better accessibility and maintainability.
 *
 * @requires Feature toggle: disabilityCompensationToxicExposureDestructionModal
 * @see {@link https://github.com/department-of-veterans-affairs/va.gov-team} VA.gov Team Repository
 */
describe('Toxic Exposure Destruction Modal', () => {
  // Test data constants for better maintainability
  const TEST_DATA = {
    asthmaWithGulfWar: {
      conditions: { asthma: true },
      gulfWar1990: { iraq: true },
      gulfWar1990Details: {
        iraq: {
          startDate: '1991-01-01',
          endDate: '1991-12-31',
        },
      },
    },
    asthmaOnly: {
      conditions: { asthma: true },
    },
    tinnitusOnly: {
      conditions: { tinnitus: true },
    },
  };

  const SERVICE_PERIOD = {
    branch: 'Marine Corps',
    from: { month: 'May', day: '20', year: '1984' },
    to: { month: 'May', day: '20', year: '2011' },
  };

  beforeEach(() => {
    // Clear and set up session storage
    cy.window().then(win => {
      win.sessionStorage.setItem(SHOW_8940_4192, 'true');
      win.sessionStorage.removeItem(WIZARD_STATUS);
      win.sessionStorage.removeItem(FORM_STATUS_BDD);
    });

    // Set up standard mocks with consistent configuration
    setupStandardMocks({
      user: mockUser,
      mockItf,
      mockInProgress,
      mockLocations,
      mockPayment,
      mockUpload,
      mockSubmit,
      mockServiceBranches,
      MOCK_SIPS_API,
    });
  });

  /**
   * Helper to set up feature toggle and prefill data for toxic exposure
   * @param {boolean} featureEnabled - Whether the destruction modal feature is enabled
   * @param {object} toxicExposureData - The toxic exposure data to prefill
   */
  const setupToxicExposureTest = (featureEnabled, toxicExposureData = {}) => {
    // Set up feature toggle
    cy.intercept('GET', '/v0/feature_toggles*', {
      statusCode: 200,
      body: {
        data: {
          type: 'feature_toggles',
          features: [
            ...mockFeatureToggles.data.features,
            {
              name: 'disabilityCompensationToxicExposureDestructionModal',
              value: featureEnabled,
            },
          ],
        },
      },
    });

    // Load and set up prefill data
    cy.fixture(
      path.join(__dirname, 'fixtures/data/maximal-toxic-exposure-test.json'),
    ).then(data => {
      const sanitizedRatedDisabilities = (data.ratedDisabilities || []).map(
        ({ 'view:selected': _, ...obj }) => obj,
      );

      cy.intercept('GET', `${MOCK_SIPS_API}*`, {
        formData: {
          veteran: {
            primaryPhone: '4445551212',
            emailAddress: 'test2@test1.net',
          },
          disabilities: sanitizedRatedDisabilities,
          toxicExposure: toxicExposureData,
        },
        metadata: {
          version: 0,
          prefill: true,
          returnUrl: '/toxic-exposure/conditions',
        },
      });
    });
  };

  /**
   * Helper to navigate through the initial form sections
   */
  const navigateToConditionsSection = () => {
    cy.visit('/disability/file-disability-claim-form-21-526ez/introduction');

    // Start the application
    skipWizard();
    startApplication();

    // Navigate through ITF and initial sections
    clickContinue(); // ITF message
    clickContinue(); // Proceed to main form

    // Wait for housing situation page (prefilled data skips earlier pages)
    waitForPageNavigation('/housing-situation');

    // Select housing status and continue through basic info pages
    selectNo();
    navigateThroughPages([
      'Housing situation',
      'Terminally ill',
      'Alternative names',
    ]);

    // Fill military history
    fillServicePeriod(SERVICE_PERIOD);
    clickContinue();

    // Navigate through pay sections
    navigateThroughPages(['Separation pay']);

    // Retirement pay
    selectNo();
    clickContinue();

    // Training pay
    selectNo();
    clickContinue();

    // Add a condition
    addDisabilityCondition('asthma');
    clickContinue();

    // Fill condition follow-up
    clickContinue(); // Follow up intro
    fillConditionFollowUp('NEW', 'Asthma condition description');
  };

  /**
   * @test
   * @description Verifies that when a user has toxic exposure conditions selected,
   * goes back and selects "none", a confirmation modal appears. When the user
   * confirms deletion, all toxic exposure data is removed from the form.
   *
   * @expected Modal appears with warning about data deletion
   * @expected Clicking "Yes, remove condition" removes toxic exposure data
   * @expected Alert confirms data removal
   * @expected Form navigates away from toxic exposure section
   */
  it('should show modal and delete toxic exposure data when user goes back and selects "none"', () => {
    // Set up test with feature enabled and prefilled toxic exposure data
    setupToxicExposureTest(true, TEST_DATA.asthmaWithGulfWar);

    // Navigate to the conditions section
    navigateToConditionsSection();

    // Run accessibility check after page loads
    cy.injectAxeThenAxeCheck();

    // Now on toxic exposure conditions page
    // Verify pre-selected condition
    verifyVACheckboxState('asthma', true);

    // Uncheck the selected condition and select "none"
    interactWithVAComponent('va-checkbox[value="asthma"]');
    interactWithVAComponent('va-checkbox[value="none"]');

    // Trigger the modal
    clickContinue();

    // Verify modal appears with correct content
    verifyModalVisibility(true);
    verifyModalContent([
      'Remove condition related to toxic exposure?',
      'Gulf War service locations and dates',
      'Agent Orange exposure locations and dates',
      'Other toxic exposure details and dates',
    ]);

    // Confirm deletion
    clickModalButton('Yes, remove condition');

    // Verify modal closes
    verifyModalVisibility(false);

    // Verify confirmation alert
    verifyAlert('warning', 'removed toxic exposure conditions from your claim');

    // Continue navigation
    clickContinue();

    // Verify we navigated away from toxic exposure page
    waitForPageNavigation('/pow');
    cy.url().should('not.include', '/toxic-exposure/conditions');

    // Continue through remaining form sections
    selectNo();
    clickContinue();

    navigateThroughPages([
      'Additional disability benefits',
      'Summary of conditions',
    ]);

    // Navigate through supporting evidence
    clickContinue();
    selectNo();
    navigateThroughPages([
      'Evidence types',
      'Summary of evidence',
      'Next steps',
    ]);

    // Additional information
    clickContinue();
    selectNo();
    clickContinue();
    selectYes();
    clickContinue();
  });

  /**
   * @test
   * @description Verifies that when a user selects "none" and the modal appears,
   * clicking "No, return to claim" cancels the action and preserves all
   * toxic exposure data in the form.
   *
   * @expected Modal appears when "none" is selected
   * @expected Clicking "No, return to claim" closes modal
   * @expected "None" checkbox remains checked after cancellation
   * @expected User can re-select conditions and continue
   */
  it('should preserve toxic exposure data when user cancels the modal', () => {
    // Set up test with feature enabled and minimal toxic exposure data
    setupToxicExposureTest(true, TEST_DATA.asthmaOnly);

    // Navigate to the conditions section
    navigateToConditionsSection();

    // Run accessibility check after page loads
    cy.injectAxeThenAxeCheck();

    // Verify pre-selected condition
    verifyVACheckboxState('asthma', true);

    // Uncheck the selected condition and select "none"
    interactWithVAComponent('va-checkbox[value="asthma"]');
    interactWithVAComponent('va-checkbox[value="none"]');

    // Trigger the modal
    clickContinue();

    // Verify modal appears
    verifyModalVisibility(true);

    // Cancel the deletion
    clickModalButton('No, return to claim');

    // Verify modal closes
    verifyModalVisibility(false);

    // Verify "none" checkbox remains checked
    verifyVACheckboxState('none', true);

    // Verify we're still on the same page
    cy.location('pathname').should('include', '/toxic-exposure/conditions');

    // Re-check asthma to continue with toxic exposure data
    interactWithVAComponent('va-checkbox[value="asthma"]');
    clickContinue();

    // Gulf War locations page - select none
    interactWithVAComponent(
      'va-checkbox[data-key="none"][name*="gulfWar1990"]',
    );
    clickContinue();
  });

  /**
   * @test
   * @description Verifies that when the toxic exposure destruction modal feature
   * toggle is disabled, selecting "none" proceeds without showing a modal,
   * demonstrating backward compatibility.
   *
   * @expected No modal appears when "none" is selected
   * @expected Form navigation continues normally
   * @expected Feature works as before the modal was introduced
   */
  it('should not show modal when feature toggle is disabled', () => {
    // Set up test with feature DISABLED
    setupToxicExposureTest(false, TEST_DATA.tinnitusOnly);

    cy.visit('/disability/file-disability-claim-form-21-526ez/introduction');

    // Navigate using helper functions
    skipWizard();
    startApplication();

    // Run accessibility check after page loads
    cy.injectAxeThenAxeCheck();

    // Navigate through initial sections
    clickContinue(); // ITF
    clickContinue(); // Main form

    // Housing situation
    waitForPageNavigation('/housing-situation');
    selectNo();

    navigateThroughPages(['Housing', 'Terminally ill', 'Alternative names']);

    // Fill military history
    fillServicePeriod(SERVICE_PERIOD);

    navigateThroughPages(['Military history', 'Separation pay']);

    // Answer No to retirement and training pay
    selectNo();
    clickContinue();
    selectNo();
    clickContinue();

    // Add tinnitus condition
    addDisabilityCondition('tinnitus');
    clickContinue();

    // Fill condition follow-up
    clickContinue(); // Follow up intro
    fillConditionFollowUp('NEW', 'Tinnitus condition description');

    // Now on toxic exposure conditions page
    // Uncheck tinnitus and select "none"
    interactWithVAComponent('va-checkbox[value="tinnitus"]');
    interactWithVAComponent('va-checkbox[value="none"]');

    // Continue without modal (feature disabled)
    clickContinue();

    // Verify modal does NOT appear
    verifyModalVisibility(false);
    cy.get('va-modal').should('not.exist');

    // Verify navigation proceeds - should be on prisoner of war page
    cy.location('pathname').should('not.include', '/toxic-exposure/conditions');
    cy.get('input[type="radio"][value="N"]').should('exist');
  });
});
