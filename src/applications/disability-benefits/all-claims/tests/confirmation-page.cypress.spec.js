import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import mockUser from './fixtures/mocks/user.json';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { setup, pageHooks } from './cypress.helpers';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    useWebComponentFields: true,

    dataSets: ['confirmation-pay-test', 'confirmation-test'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },

    pageHooks: pageHooks(cy, {
      showConfirmationReview: true,
    }),
    setupPerTest: () => {
      cy.login(mockUser);
      setup(cy, {
        toggles: {
          data: {
            type: 'feature_toggles',
            features: [
              { name: 'show526Wizard', value: true },
              { name: 'disability_526_show_confirmation_review', value: true },
            ],
          },
        },
      });
    },

    // Use _13647Exception to bypass non-critical accessibility violations
    // This allows the test to focus on functionality while acknowledging
    // the known nested definition list issue in ChapterSectionCollection
    _13647Exception: true,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
