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
          cy.get('[href="#start"]')
            .first()
            .click();
        });
      },
      '/school-administrators/commit-principles-of-excellence-form-22-10275/new-commitment-institution-details': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.fillVaTextInput(
            'root_institutionDetails_facilityCode',
            '35047621',
          );

          cy.get('va-loading-indicator', { timeout: 10000 }).should(
            'not.exist',
          );

          cy.get('#institutionHeading', { timeout: 10000 }).should(
            'contain',
            'GOVERNOR DUMMER ACADEMY',
          );
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/commit-principles-of-excellence-form-22-10275/additional-locations/:index/institution-details': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.fillVaTextInput('root_facilityCode', '31879132');

          cy.get('va-loading-indicator', { timeout: 10000 }).should(
            'not.exist',
          );

          cy.get('#institutionHeading', { timeout: 10000 }).should('exist');
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/commit-principles-of-excellence-form-22-10275/additional-locations/:index/point-of-contact': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('.radio-container', { timeout: 10000 }).should('exist');
          cy.get(
            'va-radio-option[name="pointOfContact"][value="authorizedOfficial"]',
            {
              timeout: 10000,
            },
          )
            .first()
            .should('be.visible')
            .click();
          cy.get(
            'va-radio-option[name="pointOfContact"][value="authorizedOfficial"]',
          )
            .first()
            .should('have.attr', 'checked');
          cy.get('va-radio[name="pointOfContact"]', { timeout: 5000 }).should(
            'have.attr',
            'value',
            'authorizedOfficial',
          );
          // cy.clickFormContinue();
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/commit-principles-of-excellence-form-22-10275/additional-locations': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.window().then(win => {
            const k = '__allPropSummaryVisited';
            if (!win[k]) {
              // eslint-disable-next-line no-param-reassign
              win[k] = true;
              cy.selectVaRadioOption('root_addMoreLocations', 'Y');
            } else {
              cy.selectVaRadioOption('root_addMoreLocations', 'N');
            }
          });
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/commit-principles-of-excellence-form-22-10275/review-and-submit': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('[id="checkbox-element"]', { timeout: 10000 }).check({
            force: true,
          });
          cy.get('[id="inputField"]', { timeout: 10000 }).type(
            'Jane Middle Doe',
            {
              force: true,
            },
          );

          cy.injectAxeThenAxeCheck();
          cy.tabToSubmitForm();
        });
      },
    },
    setupPerTest: () => {
      // cy.intercept('POST', formConfig.submitUrl);
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
      // cy.login();
      cy.intercept('POST', '**/v0/education_benefits_claims/10275', {
        statusCode: 200,
        body: {},
      }).as('submitForm');
      cy.intercept('GET', '/v0/in_progress_forms/22-10275', {
        statusCode: 200,
        body: {},
      });
      cy.intercept('PUT', '/v0/in_progress_forms/22-10275', {
        statusCode: 200,
        body: {},
      });
      cy.login();
    },
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
