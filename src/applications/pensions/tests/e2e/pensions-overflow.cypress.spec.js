import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import overflowFixture from 'vets-json-schema/dist/21P-527EZ-OVERFLOW-cypress-example.json';

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
    dataSets: [{ title: 'overflow', data: overflowFixture }],
    pageHooks,
    setupPerTest: () => {
      cy.login(mockUser);
      setupPerTest(cy);
    },
    // Skip tests in CI since it's prone to take a long time
    skip: Cypress.env('CI'),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
