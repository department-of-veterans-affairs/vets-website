import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import mockPrefill from './fixtures/mocks/prefill.inProgress.ohi.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import {
  fillStatementOfTruthAndSubmit,
  setupForAuth,
  startAsInProgressUser,
} from './utils';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['ohi.medicare', 'ohi.health-insurance'],
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => startAsInProgressUser());
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => fillStatementOfTruthAndSubmit());
      },
    },
    setupPerTest: () => setupForAuth({ prefill: mockPrefill }),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
