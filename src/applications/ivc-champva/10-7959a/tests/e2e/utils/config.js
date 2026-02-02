import path from 'path';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../../config/form';
import manifest from '../../../manifest.json';
import { fillStatementOfTruthAndSubmit } from './fillers';
import { startAsNewUser } from './helpers';
import { setupForGuest } from './setup';

export const getConfig = (dataSets = []) =>
  createTestConfig({
    dataSets,
    dataPrefix: 'data',
    fixtures: { data: path.join(__dirname, 'fixtures/data') },
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => startAsNewUser());
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => fillStatementOfTruthAndSubmit());
      },
    },
    setupPerTest: () => setupForGuest(),
    manifest,
    formConfig,
  });
