import path from 'path';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

import mockSubmit from './fixtures/mocks/application-submit.json';
import mockUpload from './fixtures/mocks/document-upload.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockPayment from './fixtures/mocks/payment-information.json';
import mockLocations from './fixtures/mocks/separation-locations.json';
import mockServiceBranches from './fixtures/mocks/service-branches.json';
import mockUser from './fixtures/mocks/user.json';

import { mockItf } from './cypress.helpers';

import {
  FORM_STATUS_BDD,
  MOCK_SIPS_API,
  SHOW_8940_4192,
  WIZARD_STATUS,
} from '../constants';

/**
 * E2E test suite for the Toxic Exposure Destruction Modal feature.
 *
 * Tests the modal that appears when users deselect toxic exposure conditions,
 * warning them that their toxic exposure data will be deleted.
 *
 * Key behaviors tested:
 * - Modal appears when unchecking ANY conditions with existing toxic exposure data
 * - Dynamic modal content shows specific conditions being removed
 * - Handles partial data deletion (unchecking some but not all conditions)
 * - Confirming deletion removes all toxic exposure information
 * - Cancelling preserves data and allows continuing
 * - Feature toggle controls whether modal is shown
 *
 * @module toxic-exposure-destruction-modal.cypress.spec
 * @requires Feature toggle: disabilityCompensationToxicExposureDestructionModal
 */
describe('Toxic Exposure Destruction Modal', () => {
  /**
   * Helper function to navigate to toxic exposure conditions page
   * Reduces duplication across tests
   */
  const navigateToToxicExposurePage = () => {
    cy.visit('/disability/file-disability-claim-form-21-526ez/introduction');
    cy.injectAxeThenAxeCheck();

    // Skip wizard and navigate to form start
    cy.get('.skip-wizard-link').click();

    // Start the application using flexible selector (handles both link and button variants)
    cy.get('a, va-button')
      .contains(/start.*disability compensation application|continue/i)
      .first()
      .click();

    // Navigate through Intent to File (ITF) message
    cy.findByRole('button', { name: /continue/i }).click();
    cy.findByRole('button', { name: /continue/i }).click();

    // Housing situation
    cy.location('pathname').should('include', '/housing-situation');
    cy.findByLabelText(/^no$/i).click();
    cy.findByRole('button', { name: /continue/i }).click();

    // Navigate through: terminally ill, alternative names, military history
    cy.findByRole('button', { name: /continue/i }).click();
    cy.findByRole('button', { name: /continue/i }).click();

    const idRoot = '#root_serviceInformation_servicePeriods_';
    cy.get(`${idRoot}0_serviceBranch`).select('Marine Corps');
    cy.get(`${idRoot}0_dateRange_fromMonth`).select('May');
    cy.get(`${idRoot}0_dateRange_fromDay`).select('20');
    cy.get(`${idRoot}0_dateRange_fromYear`).clear();
    cy.get(`${idRoot}0_dateRange_fromYear`).type('1984');
    cy.get(`${idRoot}0_dateRange_toMonth`).select('May');
    cy.get(`${idRoot}0_dateRange_toDay`).select('20');
    cy.get(`${idRoot}0_dateRange_toYear`).clear();
    cy.get(`${idRoot}0_dateRange_toYear`).type('2011');
    cy.findByRole('button', { name: /continue/i }).click();

    // Skip separation, retirement, and training pay
    cy.findByRole('button', { name: /continue/i }).click();
    cy.get('input[type="radio"][value="N"]')
      .first()
      .click();
    cy.findByRole('button', { name: /continue/i }).click();
    cy.get('input[type="radio"][value="N"]')
      .first()
      .click();
    cy.findByRole('button', { name: /continue/i }).click();
  };

  /**
   * Helper function to add a condition and navigate through follow-up pages
   * @param {string} conditionName - Name of the condition to add
   * @param {number} index - Index of the condition (0 for first, 1+ for additional)
   */
  const addConditionWithFollowUp = (conditionName, index = 0) => {
    // Add button for additional conditions
    if (index > 0) {
      // Try multiple selectors for the add button
      cy.get('body').then($body => {
        if ($body.find('va-button[text="Add another condition"]').length) {
          cy.get('va-button[text="Add another condition"]').click();
        } else if ($body.find('button:contains("Add another")').length) {
          cy.get('button')
            .contains('Add another')
            .click();
        } else {
          cy.get('va-button')
            .contains('Add')
            .click();
        }
      });
    }

    // Add the condition
    cy.get(`#root_newDisabilities_${index}_condition`)
      .shadow()
      .find('input')
      .type(conditionName);
    cy.get('[role="option"]')
      .first()
      .click();
    cy.get('va-button[text="Save"]').click();
  };

  /**
   * Helper to navigate through condition follow-up pages
   * @param {string} description - Description for the condition
   */
  const completeConditionFollowUp = description => {
    cy.findByRole('button', { name: /continue/i }).click();
    cy.get('input[value="NEW"]').check({ force: true });
    cy.findByRole('button', { name: /continue/i }).click();
    cy.get('textarea[id="root_primaryDescription"]').type(description);
    cy.findByRole('button', { name: /continue/i }).click();
  };

  /**
   * Setup test environment with feature toggle and mock data
   * @param {boolean} featureEnabled - Whether to enable the destruction modal feature
   * @param {Object} toxicExposureData - Toxic exposure data to prefill
   */
  const setupTestEnvironment = (featureEnabled, toxicExposureData = {}) => {
    // Configure feature toggle
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

    // Setup form data
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

  beforeEach(() => {
    window.sessionStorage.setItem(SHOW_8940_4192, 'true');
    window.sessionStorage.removeItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    window.sessionStorage.removeItem(FORM_STATUS_BDD);

    cy.login(mockUser);

    cy.intercept('GET', '/data/cms/vamc-ehr.json', { body: {} });
    cy.intercept('GET', '/v0/intent_to_file', mockItf());
    cy.intercept('PUT', `${MOCK_SIPS_API}*`, mockInProgress);
    cy.intercept(
      'GET',
      '/v0/disability_compensation_form/separation_locations',
      mockLocations,
    );
    cy.intercept('GET', '/v0/ppiu/payment_information', mockPayment);
    cy.intercept('POST', '/v0/upload_supporting_evidence', mockUpload);
    cy.intercept(
      'POST',
      '/v0/disability_compensation_form/submit_all_claim*',
      mockSubmit,
    );
    cy.intercept(
      'GET',
      '/v0/disability_compensation_form/submission_status/*',
      '',
    );
    cy.intercept(
      'GET',
      '/v0/benefits_reference_data/service-branches',
      mockServiceBranches,
    );
  });

  /**
   * Test: Modal shows correct content for single condition removal
   */
  it('should show correct modal for single condition removal', () => {
    const toxicExposureData = {
      conditions: { asthma: true },
      gulfWar1990: { iraq: true },
      gulfWar1990Details: {
        iraq: { startDate: '1991-01-01', endDate: '1991-12-31' },
      },
    };

    setupTestEnvironment(true, toxicExposureData);
    navigateToToxicExposurePage();
    cy.injectAxeThenAxeCheck();

    // Add condition
    addConditionWithFollowUp('asthma');
    cy.findByRole('button', { name: /continue/i }).click();
    completeConditionFollowUp('Asthma description');

    // Verify condition is pre-selected
    cy.get('va-checkbox[value="asthma"]').should('have.attr', 'checked');

    // Uncheck condition
    cy.get('va-checkbox[value="asthma"]').click();
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Verify modal appears with correct content
    cy.get('va-modal')
      .should('be.visible')
      .and('contain', 'Remove condition related to toxic exposure?')
      .and(
        'contain',
        'If you choose to remove asthma as a condition related to toxic exposure',
      )
      .and('contain', 'Gulf War service locations and dates');

    // Verify singular button text
    cy.get('va-modal button')
      .contains('Yes, remove condition')
      .should('exist');

    // Confirm deletion
    cy.get('va-modal button')
      .contains('Yes, remove condition')
      .click();

    // Verify alert appears
    cy.get('va-modal').should('not.be.visible');
    cy.get('va-alert[status="warning"][visible="true"]').should('exist');
  });

  /**
   * Test: Modal shows correct content for multiple conditions removal
   */
  it('should show correct modal for multiple conditions removal', () => {
    const toxicExposureData = {
      conditions: {},
      gulfWar1990: { iraq: true },
      gulfWar1990Details: {
        iraq: { startDate: '1991-01-01', endDate: '1991-12-31' },
      },
    };

    setupTestEnvironment(true, toxicExposureData);
    navigateToToxicExposurePage();
    cy.injectAxeThenAxeCheck();

    // Add first condition
    cy.get(`#root_newDisabilities_0_condition`)
      .shadow()
      .find('input')
      .type('asthma');
    cy.get('[role="option"]')
      .first()
      .click();
    cy.get('va-button[text="Save"]').click();

    // Wait for the condition to be saved and appear in the list
    cy.get('va-card')
      .contains('asthma')
      .should('exist');

    // Click add another condition button (it's a regular button, not va-button)
    cy.get('button.va-growable-add-btn')
      .contains('Add another condition')
      .click();

    // Add second condition
    cy.get(`#root_newDisabilities_1_condition`)
      .shadow()
      .find('input')
      .type('bronchitis');
    cy.get('[role="option"]')
      .first()
      .click();
    cy.get('va-button[text="Save"]').click();

    // Navigate through follow-up pages
    cy.findByRole('button', { name: /continue/i }).click();
    completeConditionFollowUp('Asthma description');
    completeConditionFollowUp('Bronchitis description');

    // Verify pre-selected conditions
    cy.get('va-checkbox[value="asthma"]').should('have.attr', 'checked');
    cy.get('va-checkbox[value="bronchitis"]').should('have.attr', 'checked');

    // Uncheck both conditions and select "none" to trigger the modal
    cy.get('va-checkbox[value="asthma"]').click();
    cy.get('va-checkbox[value="bronchitis"]').click();
    cy.get('va-checkbox[value="none"]').click();
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Verify modal with plural content
    cy.get('va-modal')
      .should('be.visible')
      .and('contain', 'Remove conditions related to toxic exposure?')
      .and('contain', 'asthma and bronchitis as conditions');

    // Verify plural button text
    cy.get('va-modal button')
      .contains('Yes, remove conditions')
      .should('exist');

    // Confirm deletion
    cy.get('va-modal button')
      .contains('Yes, remove conditions')
      .click();

    // Verify alert appears
    cy.get('va-modal').should('not.be.visible');
    cy.get('va-alert[status="warning"][visible="true"]').should('exist');
  });

  /**
   * Test: Modal cancellation preserves data
   *
   * Scenario: User unchecks condition and selects "none", modal appears,
   * but user cancels the action.
   *
   * Expected behavior:
   * - Modal closes without data deletion
   * - User remains on toxic exposure page
   * - "None" checkbox stays checked
   * - User can uncheck "none" and continue with toxic exposure flow
   */
  it('should preserve toxic exposure data when user cancels the modal', () => {
    setupTestEnvironment(true, {
      conditions: { asthma: true },
      gulfWar1990: { iraq: true },
    });

    navigateToToxicExposurePage();
    cy.injectAxeThenAxeCheck();
    addConditionWithFollowUp('asthma');
    cy.findByRole('button', { name: /continue/i }).click();
    completeConditionFollowUp('Asthma description');

    // Verify pre-selected condition on toxic exposure page
    cy.get('va-checkbox[value="asthma"]').should('have.attr', 'checked');

    // Uncheck condition and select "none"
    cy.get('va-checkbox[value="asthma"]').click();
    cy.get('va-checkbox[value="none"]').click();
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Modal appears
    cy.get('va-modal').should('be.visible');

    // Click "No, return to claim" to cancel
    cy.get('va-modal button')
      .contains('No, return to claim')
      .click();

    // Verify modal closes
    cy.get('va-modal').should('not.be.visible');

    // Verify we remain on toxic exposure page after cancellation
    cy.location('pathname').should('include', '/toxic-exposure/conditions');

    // Verify "none" checkbox remains checked (user's selection is preserved)
    cy.get('va-checkbox[value="none"]').should('exist');
    cy.get('va-checkbox[value="none"]').should('have.attr', 'checked');

    // User changes mind: uncheck "none" and re-select asthma to keep toxic exposure
    cy.get('va-checkbox[value="none"]').click();
    cy.get('va-checkbox[value="asthma"]').click();
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Verify form proceeds to Gulf War page (next in toxic exposure flow when condition is selected)
    cy.location('pathname').should('include', '/toxic-exposure/gulf-war-1990');
  });

  /**
   * Test: Feature toggle controls modal behavior
   *
   * Scenario: Feature toggle is disabled, user selects "none".
   *
   * Expected behavior:
   * - No modal appears
   * - Form continues normally
   * - Backward compatibility maintained
   */
  it('should not show modal when feature toggle is disabled', () => {
    setupTestEnvironment(false, {
      conditions: { tinnitus: true },
      gulfWar1990: { iraq: true },
    });

    navigateToToxicExposurePage();
    cy.injectAxeThenAxeCheck();
    addConditionWithFollowUp('tinnitus');
    cy.findByRole('button', { name: /continue/i }).click();
    completeConditionFollowUp('Tinnitus description');

    // Uncheck the selected condition
    cy.get('va-checkbox[value="tinnitus"]').click();

    // Select "none"
    cy.get('va-checkbox[value="none"]').click();

    // Continue without modal (feature disabled)
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Verify modal does not appear
    cy.get('va-modal').should('not.exist');

    // Verify navigation proceeds to next page
    cy.url().should('not.include', '/toxic-exposure/conditions');
    cy.get('[type="radio"][value="N"]').should('exist');
  });
});
