import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import { cloneDeep } from 'lodash';
import mockUser from './fixtures/mocks/user.json';
import mockFeatureToggles from './fixtures/mocks/feature-toggles.json';
import formConfig from '../config/form';
import manifest from '../manifest.json';
import { setup, pageHooks } from './cypress.helpers';

const toggles = cloneDeep(mockFeatureToggles);
toggles.data.features.push({
  name: 'disability_526_improved_autosuggestions_add_disabilities_page',
  value: true,
});

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    useWebComponentFields: true,

    dataSets: ['newOnly-test'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },

    pageHooks: pageHooks(cy, { toggles }),
    setupPerTest: () => {
      cy.login(mockUser);
      setup(cy, { toggles });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
