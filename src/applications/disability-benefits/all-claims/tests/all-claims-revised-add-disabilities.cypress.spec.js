import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import mockUser from './fixtures/mocks/user.json';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { setup, pageHooks } from './cypress.helpers';

const mockFeatureToggles = {
  data: {
    type: 'feature_toggles',
    features: [
      {
        name: 'show526Wizard',
        value: true,
      },
      {
        name: 'form526_confirmation_email',
        value: true,
      },
      {
        name: 'form526_confirmation_email_show_copy',
        value: true,
      },
      {
        name: 'subform_8940_4192',
        value: true,
      },
      {
        // This is the feature toggle that is being tested
        name: 'disability_526_improved_autosuggestions_add_disabilities_page',
        value: true,
      },
    ],
  },
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    useWebComponentFields: true,

    // dataSets: ['minimal-test', 'newOnly-test', 'maximal-test'],
    dataSets: ['newOnly-test'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },

    pageHooks: pageHooks(cy),
    setupPerTest: () => {
      cy.login(mockUser);
      setup(cy, mockFeatureToggles);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
