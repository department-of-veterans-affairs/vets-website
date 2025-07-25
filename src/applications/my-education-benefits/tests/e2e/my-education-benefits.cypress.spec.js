import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import { submissionForm } from '../fixtures/data/form-submission-test-data';
import { mebUser } from '../fixtures/data/userResponse';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: null,
    dataSets: [
      {
        title: 'meb-happy-path',
        data: submissionForm.data,
      },
    ],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          // Wait for critical startup calls to resolve before interacting with the page.
          // This ensures the page has stabilized and the gating condition for the
          // SaveInProgressIntro component has been met.
          cy.wait([
            '@mockUser',
            '@getFeatureToggles',
            '@getDirectDeposit',
            '@getVamcEhr',
          ]);
          cy.findByText('Begin your application for education benefits', {
            selector: 'h2',
          }).should('exist');

          // The green action link should now be in the DOM and visible
          cy.get('a.vads-c-action-link--green', { timeout: 10000 })
            .should('be.visible')
            .first()
            .click();
        });
      },
      'service-history': ({ afterHook }) => {
        afterHook(() => {
          // Ensure the main checkbox is checked (re-query after click to avoid detach)
          cy.findByLabelText(
            'This information is incorrect and/or incomplete',
          ).then($el => {
            if (!$el.is(':checked')) {
              cy.wrap($el).click({ force: true });
            }
          });

          // Secondary checkbox
          cy.findByLabelText(
            'I am not currently on Active Duty orders and one or more of my service periods is missing.',
          ).then($el => {
            if (!$el.is(':checked')) {
              cy.wrap($el).click({ force: true });
            }
          });

          // Textarea
          cy.get(
            '#root_incorrectServiceHistoryExplanation_incorrectServiceHistoryText',
          )
            .clear({ force: true })
            .type('Service periods are missing.', { force: true });

          // Give autosave a moment (optional) then click Continue
          cy.wait('@updateInProgressForm'); // waits for the PUT triggered by last change
          cy.findByRole('button', { name: /^continue/i }).click();
        });
      },
    },

    setupPerTest: () => {
      // Set up user intercepts that cy.login() expects
      cy.intercept('GET', '/v0/user', mebUser).as('mockUser');

      cy.login(mebUser);

      cy.intercept('PUT', '/v0/in_progress_forms/22-1990EZ', {
        statusCode: 200,
        body: {
          data: { attributes: { formData: {}, metadata: { version: 0 } } },
        },
      }).as('updateInProgressForm');

      cy.intercept('POST', formConfig.submitUrl, { status: 200 });
      cy.intercept('GET', '/v0/feature_toggles?*', {
        data: {
          type: 'feature_toggles',
          features: [
            { name: 'show_meb_1990EZ_maintenance_alert', value: false },
            { name: 'showMebEnhancements08', value: true },
            { name: 'show_meb_enhancements_09', value: true },
            { name: 'meb_claimant_info', value: true },
          ],
        },
      }).as('getFeatureToggles');
      cy.intercept('GET', '/data/cms/vamc-ehr.json', { data: mebUser }).as(
        'getVamcEhr',
      );
      cy.intercept('GET', '/meb_api/v0/claimant_info', {
        data: {
          type: 'claimant_info',
          id: 'some_id',
          attributes: {
            claimant: {
              dateOfBirth: '1990-01-01',
              firstName: 'John',
              lastName: 'Doe',
              ssn: '123-456-7890',
            },
          },
        },
      }).as('getClaimantInfo');
      cy.intercept('POST', '/meb_api/v0/duplicate_contact_info', {
        data: {
          attributes: {
            email: [{ dupe: false }],
            phone: [{ dupe: false }],
          },
        },
      }).as('getDuplicateContactInfo');
      cy.intercept('GET', '/meb_api/v0/claim_status', {
        data: {
          attributes: {
            claimStatus: 'ELIGIBLE',
          },
        },
      }).as('getClaimStatus');
      cy.intercept('GET', '/v0/profile/direct_deposits', {
        data: {
          attributes: {},
        },
      }).as('getDirectDeposit');
    },
    _13647Exception: true,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
