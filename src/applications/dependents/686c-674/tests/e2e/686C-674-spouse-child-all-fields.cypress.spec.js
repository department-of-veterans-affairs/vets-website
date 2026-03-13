import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import { setupCypress, pageHooks } from './cypress.helpers';

Cypress.config('waitForAnimations', true);

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['spouse-child-all-fields'],
    fixtures: { data: path.join(__dirname, 'fixtures') },
    setupPerTest: setupCypress,
    pageHooks,
    // skip: Cypress.env('CI'),
  },

  manifest,
  formConfig,
);

testForm(testConfig);
