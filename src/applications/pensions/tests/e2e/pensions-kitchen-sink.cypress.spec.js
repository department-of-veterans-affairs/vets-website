import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import kitchenSinkFixture from 'vets-json-schema/dist/21P-527EZ-KITCHEN_SINK-cypress-example.json';

import pageHooks from './helpers/pageHooks';
import mockUser from '../fixtures/mocks/user.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import setupPerTest from './cypress.setup';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    appName: 'Pensions',
    dataPrefix: 'data',
    dataDir: null,
    dataSets: [{ title: 'kitchen-sink', data: kitchenSinkFixture }],
    pageHooks,
    setupPerTest: () => {
      cy.login(mockUser);
      setupPerTest(cy);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
