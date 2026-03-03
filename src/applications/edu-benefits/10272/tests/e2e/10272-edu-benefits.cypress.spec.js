import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../fixtures/mocks/feature-toggles.json';
import user from '../fixtures/mocks/user.json';
import mockSubmit from '../fixtures/mocks/application-submit.json';
import prefilledForm from '../fixtures/mocks/prefilled-form.json';
import sip from '../fixtures/mocks/sip-put.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test', 'maximal-test'],
    dataDir: path.join(__dirname, '..', 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-link-action[text="Start your request for reimbursement"')
            .first()
            .click();
        });
      },
      'education-benefits-history': ({ afterHook }) => {
        afterHook(() => {
          cy.waitForTextarea();
          cy.fillPage();
          cy.tabToSubmitForm();
        });
      },
      remarks: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(({ remarks }) => {
            if (remarks) {
              cy.waitForTextarea();
              cy.fillPage();
            }
          });

          cy.tabToSubmitForm();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('#inputField').type('Rita Ann Jackson', { force: true });
          cy.get('#checkbox-element').check({ force: true });
          cy.findByText(/Continue/i, { selector: 'button' }).click();
        });
      },
    },
    setupPerTest: () => {
      Cypress.Commands.add('waitForTextarea', () => {
        cy.get('#input-type-textarea')
          .should('be.visible')
          .and('not.be.disabled')
          .clear({
            delay: 250,
            waitForAnimations: false,
          });
      });

      // Default endpoints to intercept
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('GET', '/data/cms/vamc-ehr.json', {});
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      cy.intercept('PUT', '/v0/in_progress_forms/22-10272', sip);

      // Authenticated endpoints required for login and prefill
      cy.intercept('GET', '/v0/user', user);
      cy.intercept('GET', '/v0/in_progress_forms/22-10272', prefilledForm);
      cy.login(user);
    },
    skip: Cypress.env('CI'), // Skip CI initially until content-build is merged
  },
  manifest,
  formConfig,
);

testForm(testConfig);
