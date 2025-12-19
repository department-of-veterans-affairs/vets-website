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
      'previously-applied': ({ afterHook }) => {
        afterHook(() => {
          cy.selectVaRadioOption('root_hasPreviouslyApplied', 'Y');
          cy.tabToSubmitForm();
        });
      },
      'select-va-benefit-program': ({ afterHook }) => {
        afterHook(() => {
          cy.selectVaRadioOption('root_vaBenefitProgram', 'chapter33');
          cy.tabToSubmitForm();
        });
      },
      'mailing-address': ({ afterHook }) => {
        afterHook(() => {
          cy.selectVaSelect('root_mailingAddress_country', 'USA');
          cy.fillVaTextInput('root_mailingAddress_street', 'The Street');
          cy.fillVaTextInput('root_mailingAddress_city', 'City');
          cy.selectVaSelect('root_mailingAddress_state', 'AL');
          cy.fillVaTextInput('root_mailingAddress_postalCode', '12345');
          cy.tabToSubmitForm();
        });
      },
      'test-name-and-date': ({ afterHook }) => {
        afterHook(() => {
          cy.fillVaTextInput('root_testName', 'Philosophy');
          cy.fillVaMemorableDate('root_testDate', '2020-01-01', false);
          cy.tabToSubmitForm();
        });
      },
      'organization-info': ({ afterHook }) => {
        afterHook(() => {
          cy.fillVaTextInput('root_organizationName', 'Acme Inc.');
          cy.fillVaTextInput('root_organizationAddress_street', 'The Street');
          cy.fillVaTextInput('root_organizationAddress_city', 'City');
          cy.selectVaSelect('root_organizationAddress_state', 'AL');
          cy.fillVaTextInput('root_organizationAddress_postalCode', '12345');
          cy.tabToSubmitForm();
        });
      },
      'test-cost': ({ afterHook }) => {
        afterHook(() => {
          cy.fillVaTextInput('root_testCost', '123.00');
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
