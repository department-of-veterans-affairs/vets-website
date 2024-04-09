import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';
import { WIZARD_STATUS } from '../../wizard/constants';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';
import mockStatus from './fixtures/mocks/profile-status.json';
import saveInProgress from './fixtures/mocks/saveInProgress.json';
import debts from './fixtures/mocks/debts.json';
import copays from './fixtures/mocks/copays.json';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    // removing data sets to confirm formData gets filled out properly
    // dataSets: ['fsr-minimal', 'fsr-maximal'],
    dataSets: ['fsr-minimal'],
    fixtures: { data: path.join(__dirname, 'fixtures', 'data') },

    setupPerTest: () => {
      sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
      cy.intercept('GET', '/v0/feature_toggles*', {
        data: {
          features: [
            { name: 'show_financial_status_report_wizard', value: true },
            { name: 'show_financial_status_report', value: true },
          ],
        },
      });

      cy.intercept('GET', '/v0/maintenance_windows', []);
      cy.intercept('GET', 'v0/user_transition_availabilities', {
        statusCode: 200,
      });
      cy.login(mockUser);
      cy.intercept('GET', '/v0/profile/status', mockStatus);

      cy.get('@testData').then(testData => {
        cy.intercept('PUT', '/v0/in_progress_forms/5655', testData);
        cy.intercept('GET', '/v0/in_progress_forms/5655', saveInProgress);
      });

      cy.intercept('GET', '/v0/debts', debts);
      cy.intercept('GET', '/v0/medical_copays', copays);

      cy.intercept('POST', formConfig.submitUrl, {
        statusCode: 200,
        body: {
          status: 'Document has been successfully uploaded to filenet',
        },
      }).as('submitForm');
    },

    pageHooks: {
      introduction: () => {
        cy.get('a.vads-c-action-link--green')
          .first()
          .click();
      },
      // ============================================================
      // ================== veteranInformationChapter ==================
      // ============================================================
      // 120.4-166.67
      'all-available-debts': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`input[name="request-help-with-debt"]`)
            .first()
            .check();
          cy.get(`input[name="request-help-with-copay"]`)
            .first()
            .check();
          cy.get('.usa-button-primary').click();
        });
      },
      'dependents-count': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(testData => {
            cy.get('#dependent-count')
              .shadow()
              .find('input')
              .type(testData.questions.hasDependents);
            cy.get('va-button[data-testid="custom-button-group-button"]')
              .shadow()
              .find('button:contains("Continue")')
              .click();
          });
        });
      },
      // ==============================================================
      // ================== resolutionOptionsChapter ==================
      // ==============================================================
      'resolution-option/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[type="radio"][value="monthly"]').click();
          cy.get('.usa-button-primary').click();
        });
      },
      'resolution-comment/0': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[data-testid="resolution-amount"]')
            .first()
            .shadow()
            .find('input')
            .type('10.00');
          cy.get('.usa-button-primary').click();
        });
      },
      'resolution-option/1': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[type="radio"][value="waiver"]').click();
          cy.get('.usa-button-primary').click();
        });
      },
      'resolution-waiver-agreement/1': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[type=checkbox]').check();
          cy.get('.usa-button-primary').click();
        });
      },
      'resolution-comments': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#resolution-comments')
            .shadow()
            .find('textarea')
            .type('Some Resolution Comments . . .');
          cy.get('va-button[data-testid="custom-button-group-button"]')
            .shadow()
            .find('button:contains("Continue")')
            .click();
        });
      },
      // ==============================================================
      // ================ bankruptcyAttestationChapter ================
      // ==============================================================
      'bankruptcy-history': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#has-not-declared-bankruptcy').click();
          cy.get('.usa-button-primary').click();
        });
      },
      // ============================================================
      // ======================== Review page =======================
      // ============================================================
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#veteran-signature')
            .shadow()
            .find('input')
            .first()
            .type('Mark Webb');
          cy.get(`va-checkbox[name="veteran-certify"]`)
            .shadow()
            .find('input')
            .check({ force: true });
          cy.get(`va-privacy-agreement`)
            .shadow()
            .find('input')
            .check({ force: true });
          cy.findAllByText(/Submit your request/i, {
            selector: 'button',
          }).click();
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
