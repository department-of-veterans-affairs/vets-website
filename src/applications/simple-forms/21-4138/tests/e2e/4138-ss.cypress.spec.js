import path from 'path';

import testForm from '~/platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from '~/platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/featureToggles.json';
import user from './fixtures/mocks/user.json';

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
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    // Rename and modify the test data as needed.
    dataSets: ['test-data'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/^Start your statement/, { selector: 'a' })
            .last()
            .click();
        });
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
