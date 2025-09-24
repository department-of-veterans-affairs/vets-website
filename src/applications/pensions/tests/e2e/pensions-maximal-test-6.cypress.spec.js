import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import kitchenSinkFixture from 'vets-json-schema/dist/21P-527EZ-KITCHEN_SINK-cypress-example.json';
import pagePaths from './pagePaths';

import {
  chapter12,
  chapter3,
  chapter4,
  chapter5,
} from './fixtures/data/maximal-data-parts';

import pageHooks from './helpers/pageHooks';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import cypressSetup from './cypress.setup';

const START = `/${pagePaths.directDeposit}`; // Start at chapter 6
// const STOP = '/review-and-submit';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    appName: 'Pensions',
    dataPrefix: 'data',
    dataDir: null,
    dataSets: [{ title: 'maximal-test-chapter-6', data: kitchenSinkFixture }],
    // stopTestAfterPath: STOP,
    pageHooks: pageHooks(START),
    setupPerTest: () => {
      cypressSetup({
        authenticated: true,
        isEnabled: true,
        returnUrl: START,
        prefill: { ...chapter12, ...chapter3, ...chapter4, ...chapter5 },
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
