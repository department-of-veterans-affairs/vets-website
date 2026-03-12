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
    dataSets: ['authenticated-test'],
    dataDir: path.join(__dirname, '..', 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-link-action[href="#start"]')
            .last()
            .click({ force: true });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { claimantPersonalInformation } = data;
            const { fullName } = claimantPersonalInformation;
            const name = `${fullName.first} ${fullName.middle || ''} ${
              fullName.last
            }`.trim();
            cy.get('va-statement-of-truth')
              .shadow()
              .get('#veteran-signature')
              .shadow()
              .get('input[name="veteran-signature"]')
              .type(name);
            cy.get('va-statement-of-truth')
              .shadow()
              .find('input[type="checkbox"]')
              .check({ force: true });
            cy.findByText(/submit/i, { selector: 'button' }).click();
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      cy.intercept('PUT', '/v0/in_progress_forms/22-10278', sip);
      cy.intercept('GET', '/v0/user', user);
      cy.intercept('GET', '/v0/in_progress_forms/22-10278', prefilledForm);
      cy.login(user);
    },
    skip: Cypress.env('CI'), // Skip CI initially until content-build is merged
  },
  manifest,
  formConfig,
);

testForm(testConfig);
