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

const awaitFocusSelectorThenTest = pagePath => {
  return ({ afterHook }) => {
    cy.injectAxeThenAxeCheck();
    afterHook(() => {
      const header =
        pagePath === 'authorizer-type'
          ? '#root_authorizerType-label'
          : '#nav-form-header';
      cy.get(header).should('be.visible');
      cy.fillPage();
      cy.axeCheck();
      cy.findByText(/continue/i, { selector: 'button' }).click();
    });
  };
};

const pagePaths = [
  'authorizer-type',
  'authorizer-personal-information',
  'authorizer-address',
  'authorizer-contact-information',
  'veteran-personal-information',
  'veteran-identification-information',
  'disclosure-information-third-party-type',
  'disclosure-information-person-name',
  'disclosure-information-person-address',
  'disclosure-information-organization-name',
  'disclosure-information-organization-representative',
  'disclosure-information-organization-address',
  'disclosure-information-scope',
  'disclosure-information-limited-information',
  'disclosure-information-release-duration',
  'disclosure-information-release-and-date',
  'security-information-question',
  'security-information-answer',
];

const pageTestConfigs = pagePaths.reduce((obj, pagePath) => {
  return {
    ...obj,
    [pagePath]: awaitFocusSelectorThenTest(pagePath),
  };
}, {});

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
      ...pageTestConfigs,
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
      Cypress.config({ waitForAnimations: true, defaultCommandTimeout: 8000 });
      cy.intercept('POST', formConfig.submitUrl, {
        body: {
          statusCode: 200,
        },
      });
      cy.intercept('GET', '/v0/feature_toggles*', featureToggles);

      cy.login(user);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
