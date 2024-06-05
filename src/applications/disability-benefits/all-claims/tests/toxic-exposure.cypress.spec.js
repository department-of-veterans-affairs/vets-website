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
  name: 'disability_526_toxic_exposure',
  value: true,
});

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    // run the newOnly-test to verify enabling TE doesn't break things. then also run maximal using all TE pages
    dataSets: ['newOnly-test', 'maximal-toxic-exposure-test'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },

    pageHooks: pageHooks(cy, toggles),
    setupPerTest: () => {
      cy.login(mockUser);
      setup(cy, toggles);
    },

    useWebComponentFields: true,

    // skip: [],
  },
  manifest,
  formConfig,
);

testForm(testConfig);
