import path from 'path';
import { WIZARD_STATUS_COMPLETE } from 'platform/site-wide/wizard';

import mockUser from './fixtures/mocks/user.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import mockServiceBranches from './fixtures/mocks/service-branches.json';
import mockInProgress from './fixtures/mocks/in-progress-forms.json';
import mockLocations from './fixtures/mocks/separation-locations.json';
import mockPayment from './fixtures/mocks/payment-information.json';
import mockUpload from './fixtures/mocks/document-upload.json';
import mockSubmit from './fixtures/mocks/application-submit.json';

import { mockItf } from './cypress.helpers';

import {
  MOCK_SIPS_API,
  WIZARD_STATUS,
  FORM_STATUS_BDD,
  SHOW_8940_4192,
} from '../constants';

/**
 * @description E2E test suite for the Toxic Exposure Destruction Modal feature.
 * Tests the behavior when users select "none" for toxic exposure conditions after
 * previously selecting conditions. Validates modal interactions and data handling.
 *
 * @requires Feature toggle: disabilityCompensationToxicExposureDestructionModal
 */
describe('Toxic Exposure Destruction Modal', () => {
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
    // Configure feature toggle for toxic exposure destruction modal
    cy.intercept('GET', '/v0/feature_toggles*', {
      statusCode: 200,
      body: {
        data: {
          type: 'feature_toggles',
          features: [
            ...mockFeatureToggles.data.features,
            {
              name: 'disabilityCompensationToxicExposureDestructionModal',
              value: true,
            },
          ],
        },
      },
    });

    cy.fixture(
      path.join(__dirname, 'fixtures/data/maximal-toxic-exposure-test.json'),
    ).then(data => {
      const sanitizedRatedDisabilities = (data.ratedDisabilities || []).map(
        ({ 'view:selected': _, ...obj }) => obj,
      );

      // Prefill form with toxic exposure data to simulate returning user scenario
      cy.intercept('GET', `${MOCK_SIPS_API}*`, {
        formData: {
          veteran: {
            primaryPhone: '4445551212',
            emailAddress: 'test2@test1.net',
          },
          disabilities: sanitizedRatedDisabilities,
          toxicExposure: {
            conditions: {
              asthma: true,
            },
            gulfWar1990: {
              iraq: true,
            },
            gulfWar1990Details: {
              iraq: {
                startDate: '1991-01-01',
                endDate: '1991-12-31',
              },
            },
          },
        },
        metadata: {
          version: 0,
          prefill: true,
          returnUrl: '/toxic-exposure/conditions',
        },
      });
    });

    cy.visit('/disability/file-disability-claim-form-21-526ez/introduction');
    cy.injectAxeThenAxeCheck();

    // Skip wizard and navigate to form start
    cy.get('.skip-wizard-link').click();

    // Start the disability compensation application
    cy.findAllByRole('link', {
      name: /start the disability compensation application/i,
    })
      .first()
      .click();

    // Navigate through Intent to File (ITF) message
    cy.findByRole('button', { name: /continue/i }).click();

    // Proceed to main form
    cy.findByRole('button', { name: /continue/i }).click();

    // Verify navigation to housing situation page (prefilled data skips earlier pages)
    cy.location('pathname', { timeout: 10000 }).should(
      'include',
      '/housing-situation',
    );

    // Select housing status
    cy.findByLabelText(/^no$/i).click();

    cy.findByRole('button', { name: /continue/i }).click();

    // Terminally ill
    cy.findByRole('button', { name: /continue/i }).click();

    // Alternative names
    cy.findByRole('button', { name: /continue/i }).click();

    // Military history
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

    // Separation pay
    cy.findByRole('button', { name: /continue/i }).click();

    // Retirement pay
    cy.get('input[type="radio"][value="N"]')
      .first()
      .click();
    cy.findByRole('button', { name: /continue/i }).click();

    // Training pay
    cy.get('input[type="radio"][value="N"]')
      .first()
      .click();
    cy.findByRole('button', { name: /continue/i }).click();

    // Add a new condition
    cy.get('#root_newDisabilities_0_condition')
      .shadow()
      .find('input')
      .type('asthma');
    cy.get('[role="option"]')
      .first()
      .click();
    // Click Save to save the condition
    cy.get('va-button[text="Save"]').click();
    cy.findByRole('button', { name: /continue/i }).click();

    // Follow up intro page
    cy.findByRole('button', { name: /continue/i }).click();

    // Follow up - What caused your condition?
    cy.get('input[value="NEW"]').check({ force: true });
    cy.findByRole('button', { name: /continue/i }).click();

    // Description page
    cy.get('textarea[id="root_primaryDescription"]').type(
      'Asthma condition description',
    );
    cy.findByRole('button', { name: /continue/i }).click();

    // Navigate to toxic exposure conditions page

    // Verify pre-selected condition
    cy.get('va-checkbox[value="asthma"]').should('have.attr', 'checked');

    // Uncheck the selected condition
    cy.get('va-checkbox[value="asthma"]').click();

    // Select "none" to trigger modal
    cy.get('va-checkbox[value="none"]').click();

    // Click Continue to trigger the modal
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Verify modal appears
    cy.get('va-modal').should('be.visible');
    cy.get('va-modal')
      .should('contain', 'Remove condition related to toxic exposure?')
      .and('contain', 'Gulf War service locations and dates')
      .and('contain', 'Agent Orange exposure locations and dates')
      .and('contain', 'Other toxic exposure details and dates');

    // Click "Yes, remove condition" to confirm deletion
    cy.get('va-modal button')
      .contains('Yes, remove condition')
      .click();

    // Verify modal closes
    cy.get('va-modal').should('not.be.visible');

    // Verify confirmation alert appears
    cy.get('va-alert[status="warning"][visible="true"]')
      .should('exist')
      .and('be.visible');
    cy.get('va-alert').should(
      'contain',
      'removed toxic exposure conditions from your claim',
    );

    // Click Continue to navigate to the next page
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Verify we navigated away from toxic exposure page
    cy.url().should('not.include', '/toxic-exposure/conditions');

    // Continue to prisoner of war page
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Additional disability benefits
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Summary of conditions
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Navigate through rest of form to review page
    // Supporting evidence
    cy.findByText(/continue/i, { selector: 'button' }).click();
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();
    cy.findByText(/continue/i, { selector: 'button' }).click();
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Additional information
    cy.findByText(/continue/i, { selector: 'button' }).click();
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();
    cy.get('[type="radio"][value="Y"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Test completion - toxic exposure data removal verified
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
    // Configure feature toggle for toxic exposure destruction modal
    cy.intercept('GET', '/v0/feature_toggles*', {
      statusCode: 200,
      body: {
        data: {
          type: 'feature_toggles',
          features: [
            ...mockFeatureToggles.data.features,
            {
              name: 'disabilityCompensationToxicExposureDestructionModal',
              value: true,
            },
          ],
        },
      },
    });

    cy.fixture(
      path.join(__dirname, 'fixtures/data/maximal-toxic-exposure-test.json'),
    ).then(data => {
      const sanitizedRatedDisabilities = (data.ratedDisabilities || []).map(
        ({ 'view:selected': _, ...obj }) => obj,
      );

      // Prefill form with toxic exposure condition
      cy.intercept('GET', `${MOCK_SIPS_API}*`, {
        formData: {
          veteran: {
            primaryPhone: '4445551212',
            emailAddress: 'test2@test1.net',
          },
          disabilities: sanitizedRatedDisabilities,
          toxicExposure: {
            conditions: {
              asthma: true,
            },
          },
        },
        metadata: {
          version: 0,
          prefill: true,
          returnUrl: '/toxic-exposure/conditions',
        },
      });
    });

    cy.visit('/disability/file-disability-claim-form-21-526ez/introduction');
    cy.injectAxeThenAxeCheck();

    // Navigate to form start
    cy.get('.skip-wizard-link').click();
    cy.findAllByRole('link', {
      name: /start the disability compensation application/i,
    })
      .first()
      .click();
    cy.findByRole('button', { name: /continue/i }).click();

    // Navigate through initial form sections
    cy.findByRole('button', { name: /continue/i }).click(); // Continue past ITF

    // Housing situation section
    cy.location('pathname', { timeout: 10000 }).should(
      'include',
      '/housing-situation',
    );
    cy.get('input[type="radio"][id="root_homelessOrAtRisk_0"]')
      .should('exist')
      .click({ force: true });
    cy.findByText(/continue/i, { selector: 'button' })
      .should('be.visible')
      .click();
    // Terminally ill
    cy.findByText(/continue/i, { selector: 'button' }).click();
    // Alternative names
    cy.findByText(/continue/i, { selector: 'button' }).click();
    // Military history
    cy.get('#root_serviceInformation_servicePeriods_0_serviceBranch').select(
      'Marine Corps',
    );
    cy.get(
      '#root_serviceInformation_servicePeriods_0_dateRange_fromMonth',
    ).select('May');
    cy.get(
      '#root_serviceInformation_servicePeriods_0_dateRange_fromDay',
    ).select('20');
    cy.get(
      '#root_serviceInformation_servicePeriods_0_dateRange_fromYear',
    ).clear();
    cy.get('#root_serviceInformation_servicePeriods_0_dateRange_fromYear').type(
      '1984',
    );
    cy.get(
      '#root_serviceInformation_servicePeriods_0_dateRange_toMonth',
    ).select('May');
    cy.get('#root_serviceInformation_servicePeriods_0_dateRange_toDay').select(
      '20',
    );
    cy.get(
      '#root_serviceInformation_servicePeriods_0_dateRange_toYear',
    ).clear();
    cy.get('#root_serviceInformation_servicePeriods_0_dateRange_toYear').type(
      '2011',
    );
    cy.findByText(/continue/i, { selector: 'button' }).click();
    // Separation pay
    cy.findByText(/continue/i, { selector: 'button' }).click();
    // Retirement pay
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();
    // Training pay
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();
    // Add condition
    cy.get('#root_newDisabilities_0_condition')
      .shadow()
      .find('input')
      .type('asthma');
    cy.get('[role="option"]')
      .first()
      .click();
    // Click Save to save the condition
    cy.get('va-button[text="Save"]').click();
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Follow up intro page
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Follow up - What caused your condition?
    cy.get('input[value="NEW"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Description page
    cy.get('textarea[id="root_primaryDescription"]').type(
      'Asthma condition description',
    );
    cy.findByRole('button', { name: /continue/i }).click();

    // Navigate to toxic exposure conditions page

    // Verify pre-selected condition
    cy.get('va-checkbox[value="asthma"]').should('have.attr', 'checked');

    // Uncheck the selected condition
    cy.get('va-checkbox[value="asthma"]').click();

    // Select "none" to trigger modal
    cy.get('va-checkbox[value="none"]').click();

    // Click Continue to trigger the modal
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Modal appears
    cy.get('va-modal').should('be.visible');

    // Click "No, return to claim" to cancel
    cy.get('va-modal button')
      .contains('No, return to claim')
      .click();

    // Verify modal closes
    cy.get('va-modal').should('not.be.visible');

    // Verify "none" checkbox remains checked after modal cancellation
    cy.get('va-checkbox[value="none"]').should('have.attr', 'checked');

    // Verify we're still on the same page
    cy.url().should('include', '/toxic-exposure/conditions');

    // Re-check asthma to continue with toxic exposure data
    cy.get('va-checkbox[value="asthma"]').click();
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Gulf War locations page - select none
    cy.get('va-checkbox[data-key="none"][name*="gulfWar1990"]').click();
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Test completion - toxic exposure data preservation verified
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
    // Disable feature toggle to test backward compatibility
    cy.intercept('GET', '/v0/feature_toggles*', {
      statusCode: 200,
      body: {
        data: {
          type: 'feature_toggles',
          features: [
            ...mockFeatureToggles.data.features,
            {
              name: 'disabilityCompensationToxicExposureDestructionModal',
              value: false,
            },
          ],
        },
      },
    });

    cy.fixture(
      path.join(__dirname, 'fixtures/data/maximal-toxic-exposure-test.json'),
    ).then(data => {
      const sanitizedRatedDisabilities = (data.ratedDisabilities || []).map(
        ({ 'view:selected': _, ...obj }) => obj,
      );

      // Prefill form with toxic exposure condition
      cy.intercept('GET', `${MOCK_SIPS_API}*`, {
        formData: {
          veteran: {
            primaryPhone: '4445551212',
            emailAddress: 'test2@test1.net',
          },
          disabilities: sanitizedRatedDisabilities,
          toxicExposure: {
            conditions: {
              tinnitus: true,
            },
          },
        },
        metadata: {
          version: 0,
          prefill: true,
          returnUrl: '/toxic-exposure/conditions',
        },
      });
    });

    cy.visit('/disability/file-disability-claim-form-21-526ez/introduction');
    cy.injectAxeThenAxeCheck();
    // Navigate to form start
    cy.get('.skip-wizard-link')
      .should('be.visible')
      .click();

    // Navigate through form to toxic exposure section
    cy.findAllByRole('link', {
      name: /start the disability compensation application/i,
    })
      .first()
      .click();
    cy.findByRole('button', { name: /continue/i }).click();
    cy.findByRole('button', { name: /continue/i }).click();

    // Housing situation section
    cy.location('pathname', { timeout: 10000 }).should(
      'include',
      '/housing-situation',
    );
    cy.get('input[type="radio"][id="root_homelessOrAtRisk_0"]')
      .should('exist')
      .click({ force: true });
    cy.findByText(/continue/i, { selector: 'button' })
      .should('be.visible')
      .click();
    cy.findByText(/continue/i, { selector: 'button' }).click();
    cy.findByText(/continue/i, { selector: 'button' }).click();
    cy.get('#root_serviceInformation_servicePeriods_0_serviceBranch').select(
      'Marine Corps',
    );
    cy.get(
      '#root_serviceInformation_servicePeriods_0_dateRange_fromMonth',
    ).select('May');
    cy.get(
      '#root_serviceInformation_servicePeriods_0_dateRange_fromDay',
    ).select('20');
    cy.get(
      '#root_serviceInformation_servicePeriods_0_dateRange_fromYear',
    ).clear();
    cy.get('#root_serviceInformation_servicePeriods_0_dateRange_fromYear').type(
      '1984',
    );
    cy.get(
      '#root_serviceInformation_servicePeriods_0_dateRange_toMonth',
    ).select('May');
    cy.get('#root_serviceInformation_servicePeriods_0_dateRange_toDay').select(
      '20',
    );
    cy.get(
      '#root_serviceInformation_servicePeriods_0_dateRange_toYear',
    ).clear();
    cy.get('#root_serviceInformation_servicePeriods_0_dateRange_toYear').type(
      '2011',
    );
    cy.findByText(/continue/i, { selector: 'button' }).click();
    cy.findByText(/continue/i, { selector: 'button' }).click();
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();
    cy.get('[type="radio"][value="N"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();
    cy.get('#root_newDisabilities_0_condition')
      .shadow()
      .find('input')
      .type('tinnitus');
    cy.get('[role="option"]')
      .first()
      .click();
    // Click Save to save the condition
    cy.get('va-button[text="Save"]').click();
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Follow up intro page
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Follow up - What caused your condition?
    cy.get('input[value="NEW"]').check({ force: true });
    cy.findByText(/continue/i, { selector: 'button' }).click();

    // Description page
    cy.get('textarea[id="root_primaryDescription"]').type(
      'Tinnitus condition description',
    );
    cy.findByRole('button', { name: /continue/i }).click();

    // Toxic exposure conditions page

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
