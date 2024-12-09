import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureTogglesFacilitiesApi from './fixtures/mocks/feature-toggles-facilities-api.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

import { setupPerTest, pageHooks } from './utils/helpers';

export const setupPerTestWithFacilitiesFeatureToggle = () => {
  setupPerTest();
  cy.intercept('GET', '/v0/feature_toggles?*', featureTogglesFacilitiesApi);
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['requiredOnly'],
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
      mocks: path.join(__dirname, 'fixtures', 'mocks'),
    },
    setupPerTest: setupPerTestWithFacilitiesFeatureToggle,
    pageHooks,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
