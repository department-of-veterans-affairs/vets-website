import path from 'path';

import testForm from '~/platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from '~/platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/featureToggles.json';
import user from './fixtures/mocks/user.json';
import sipPut from './fixtures/mocks/sip-put.json';
import sipGet from './fixtures/mocks/sip-get.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';

// mock logged in LOA3 user
const userLOA3 = {
  ...user,
  data: {
    ...user.data,
    attributes: {
      ...user.data.attributes,
      login: {
        currentlyLoggedIn: true,
      },
      profile: {
        ...user.data.attributes.profile,
        loa: {
          current: 3,
        },
      },
    },
  },
};

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,

    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['test-data'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/^Start/, { selector: 'a[href="#start"]' })
            .last()
            .click();
        });
      },
      'name-and-date-of-birth': ({ afterHook }) => {
        afterHook(() => {});
      },
      'identification-information': ({ afterHook }) => {
        afterHook(() => {});
      },
      'mailing-address': ({ afterHook }) => {
        afterHook(() => {});
      },
      'phone-and-email': ({ afterHook }) => {
        afterHook(() => {});
      },
      statement: ({ afterHook }) => {
        afterHook(() => {});
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {});
      },
    },

    setup: () => {
      Cypress.config({
        defaultCommandTimeout: 10000,
      });
    },

    setupPerTest: () => {
      cy.intercept('/v0/api', { status: 200 });
      cy.intercept('/v0/feature_toggles', featureToggles);
      cy.intercept('PUT', '/v0/in_progress_forms/21-4138', sipPut);
      cy.intercept('GET', '/v0/in_progress_forms/21-4138', sipGet);
      cy.intercept(formConfig.submitUrl, mockSubmit);
      cy.login(userLOA3);
    },

    // Skip tests in CI until the form is released.
    // Remove this setting when the form has a content page in production.
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
