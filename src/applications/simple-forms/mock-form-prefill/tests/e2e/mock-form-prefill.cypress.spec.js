/**
 * E2E test for mock form prefill.
 */
import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../fixtures/mocks/feature-toggles.json';
import user from '../fixtures/mocks/user.json';
import mockSubmit from '../fixtures/mocks/application-submit.json';
import mockSipGet from '../fixtures/mocks/sip-get.json';
import mockSipPut from '../fixtures/mocks/sip-put.json';
import mockVamcEhr from '../fixtures/mocks/vamc-ehr.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import { reviewAndSubmitPageFlow } from './helpers';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test'],
    dataDir: path.join(__dirname, '..', 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/^start/i, { selector: 'a[href="#start"]' })
            .last()
            .click({ force: true });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { fullName } = data;

            reviewAndSubmitPageFlow(fullName, 'Submit application');
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', user);
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('GET', '/data/cms/vamc-ehr.json', mockVamcEhr);
      cy.intercept(
        'GET',
        '/v0/in_progress_forms/FORM-MOCK-PREFILL',
        mockSipGet,
      );
      cy.intercept(
        'PUT',
        '/v0/in_progress_forms/FORM-MOCK-PREFILL',
        mockSipPut,
      );
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      cy.login(user);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
