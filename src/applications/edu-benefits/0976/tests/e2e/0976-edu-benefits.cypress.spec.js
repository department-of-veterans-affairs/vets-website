import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../fixtures/mocks/feature-toggles.json';
import user from '../fixtures/mocks/user.json';
import mockSubmit from '../fixtures/mocks/application-submit.json';
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
          cy.findAllByText(/^start your application without signing in/i, {
            selector: 'a',
          })
            .last()
            .click({ force: true });
        });
      },
      'primary-institution-details': ({ afterHook }) => {
        afterHook(() => {
          cy.selectVaRadioOption('root_hasVaFacilityCode', 'N');
          cy.tabToSubmitForm();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-text-input[id="veteran-signature"]').then(el => {
            cy.fillVaTextInput(el, 'John Doe');
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
    },
    skip: Cypress.env('CI'), // Skip CI initially until content-build is merged
  },
  manifest,
  formConfig,
);

testForm(testConfig);
