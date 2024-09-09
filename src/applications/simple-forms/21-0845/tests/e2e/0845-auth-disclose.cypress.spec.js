import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import user from './fixtures/mocks/user.json';
import { AUTHORIZER_TYPES } from '../../definitions/constants';
import {
  fillAddressWebComponentPattern,
  reviewAndSubmitPageFlow,
} from '../../../shared/tests/e2e/helpers';
import sipPut from './fixtures/mocks/in-progress-forms-put.json';
import sipGet from './fixtures/mocks/in-progress-forms-get.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    useWebComponentFields: true,
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['authTypeVet', 'authTypeNonVet'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByText(/^start your authorization/i, {
            selector: 'a',
          }).click();
        });
      },
      'authorizer-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'authorizerAddress',
              data.authorizerAddress,
            );

            cy.axeCheck('.form-panel');
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'disclosure-information-person-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern('personAddress', data.personAddress);

            cy.axeCheck('.form-panel');
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'disclosure-information-organization-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillAddressWebComponentPattern(
              'organizationAddress',
              data.organizationAddress,
            );

            cy.axeCheck('.form-panel');
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const signerName =
              data.authorizerType === AUTHORIZER_TYPES.VETERAN
                ? data.veteranFullName
                : data.authorizerFullName;
            reviewAndSubmitPageFlow(signerName, 'Submit authorization');
          });
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('POST', formConfig.submitUrl, {
        body: {
          statusCode: 200,
        },
      });
      cy.intercept('GET', '/v0/feature_toggles*', featureToggles);
      cy.intercept('PUT', '/v0/in_progress_forms/21-0845', sipPut);
      cy.intercept('GET', '/v0/in_progress_forms/21-0845', sipGet);
      cy.login(user);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
