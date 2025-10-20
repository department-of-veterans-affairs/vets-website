import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../config/form';
import manifest from '../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['maximal-test'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('.schemaform-start-button')
            .first()
            .click();
        });
      },
      '/school-administrators/update-certifying-officials/institution-details-3': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.fillVaTextInput(
            'root_institutionDetails_facilityCode',
            '10002000',
          );

          cy.get('va-loading-indicator', { timeout: 10000 }).should(
            'not.exist',
          );

          cy.get('#institutionHeading', { timeout: 10000 }).should(
            'contain',
            'INSTITUTE OF TESTING',
          );
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/update-certifying-officials/primary-certifying-official-1': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('input[type="checkbox"]').check({ force: true });
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/update-certifying-officials/primary-certifying-official-2': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.selectVaRadioOption(
            'root_primaryOfficialBenefitStatus_hasVaEducationBenefits',
            'N',
          );
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/update-certifying-officials/additional-certifying-officials': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.window().then(win => {
            const k = '__additionalOfficialSummaryVisited';
            if (!win[k]) {
              // eslint-disable-next-line no-param-reassign
              win[k] = true;
              cy.selectVaRadioOption(
                'root_view:additionalOfficialSummary',
                'Y',
              );
            } else {
              cy.selectVaRadioOption(
                'root_view:additionalOfficialSummary',
                'N',
              );
            }
          });
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/update-certifying-officials/additional-certifying-officials-1/:index': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('input[type="checkbox"]').check({ force: true });
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/update-certifying-officials/read-only-certifying-officials/summary': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.window().then(win => {
            const k = '__readOnlyOfficialSummaryVisited';
            if (!win[k]) {
              // eslint-disable-next-line no-param-reassign
              win[k] = true;
              cy.selectVaRadioOption('root_hasReadOnlyCertifyingOfficial', 'Y');
            } else {
              cy.selectVaRadioOption('root_hasReadOnlyCertifyingOfficial', 'N');
            }
          });
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/update-certifying-officials/remarks': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('va-loading-indicator', { timeout: 10000 }).should(
            'not.exist',
          );

          cy.get('#input-type-textarea', { timeout: 10000 })
            .should('be.visible')
            .and('not.be.disabled');

          cy.get('#input-type-textarea').clear({
            delay: 0,
            waitForAnimations: false,
          });

          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/update-certifying-officials/review-and-submit': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('#checkbox-element', { timeout: 10000 }).check({
            force: true,
          });
          cy.get('#inputField', { timeout: 10000 }).type('John William Doe', {
            force: true,
          });
          cy.tabToSubmitForm();
        });
      },
    },

    setupPerTest: () => {
      Cypress.Commands.overwrite(
        'axeCheck',
        (originalFn, context = 'main', options = {}) => {
          const optionsWithDisabledRule = {
            ...options,
            rules: {
              ...(options.rules || {}),
              'definition-list': {
                enabled: false,
              },
              'color-contrast': {
                enabled: false,
              },
            },
          };
          return originalFn(context, optionsWithDisabledRule);
        },
      );

      cy.intercept('POST', formConfig.submitUrl, { status: 200 });
      cy.intercept('GET', '**/gi/institutions/10002000', {
        statusCode: 200,
        body: {
          data: {
            id: '10002000',
            type: 'institution',
            attributes: {
              name: 'INSTITUTE OF TESTING',
              address1: '123 STREET WAY',
              address2: '',
              address3: '',
              city: 'SAN FRANCISCO',
              state: 'CA',
              zip: '13579',
              country: 'USA',
            },
          },
        },
      });
      // Mock save-in-progress endpoints
      cy.intercept('GET', '/v0/in_progress_forms/22-8794', {
        statusCode: 200,
        body: {},
      });
      cy.intercept('PUT', '/v0/in_progress_forms/22-8794', {
        statusCode: 200,
        body: {},
      });
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
