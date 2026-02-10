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
    dataSets: ['minimal-test'],
    dataDir: path.join(__dirname, '..', 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-link-action[href="#start"]').click();
        });
      },
      'test-name-and-date': ({ afterHook }) => {
        afterHook(() => {
          // Automated data-filling doesn't seem to work for memorable date inputs
          // that _don't_ use a month select. So we do this step manually.
          cy.fillVaTextInput('root_testName', 'Philosophy');
          cy.fillVaMemorableDate('root_testDate', '2020-01-01', false);
          cy.tabToSubmitForm();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-text-input[id="veteran-signature"]').then(el => {
            cy.fillVaTextInput(el, 'MITCHELL G JENKINS');
          });
          cy.get('va-checkbox[id="veteran-certify"]').then(el => {
            cy.selectVaCheckbox(el, true);
          });
          cy.tabToSubmitForm();
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', user);
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('GET', '/data/cms/vamc-ehr.json', {});
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      cy.intercept('GET', '/v0/in_progress_forms/22-0803', prefilledForm);
      cy.intercept('PUT', '/v0/in_progress_forms/22-0803', sip);
      cy.login(user);
    },
    skip: Cypress.env('CI'), // Skip CI initially until content-build is merged
  },
  manifest,
  formConfig,
);

testForm(testConfig);
