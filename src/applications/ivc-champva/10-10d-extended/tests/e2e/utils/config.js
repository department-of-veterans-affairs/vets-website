import path from 'path';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../../config/form';
import manifest from '../../../manifest.json';
import {
  fillSharedAddressAndContinue,
  fillStatementOfTruthAndSubmit,
} from './fillers';
import { startAsNewUser, startAsInProgressUser } from './helpers';
import { setupBasicTest, setupForAuth } from './setup';

/**
 * Creates a test config with common defaults and overrides
 * @param {Object} options
 * @param {string[]} options.dataSets - Array of dataset names
 * @param {boolean} [options.useAuth=false] - Whether to use authenticated setup
 * @param {Object} [options.prefill] - Prefill data for authenticated tests
 * @param {Object} [options.additionalPageHooks={}] - Additional page hooks to merge
 * @param {boolean} [options.includeVeteranAddressHook=false] - Include veteran-address hook
 * @param {boolean} [options.includeApplicantAddressHook=true] - Include applicant-address hook
 * @returns {Object} Test configuration
 */
export const getConfig = ({
  dataSets = [],
  useAuth = false,
  prefill,
  additionalPageHooks = {},
  includeVeteranAddressHook = false,
  includeApplicantAddressHook = false,
} = {}) => {
  const basePageHooks = {
    introduction: ({ afterHook }) => {
      afterHook(
        () =>
          useAuth ? startAsInProgressUser() : startAsNewUser({ auth: useAuth }),
      );
    },
    'review-and-submit': ({ afterHook }) => {
      afterHook(() => fillStatementOfTruthAndSubmit());
    },
  };

  const addressHooks = {};
  if (includeVeteranAddressHook) {
    addressHooks['veteran-address'] = ({ afterHook }) => {
      afterHook(() => fillSharedAddressAndContinue());
    };
  }
  if (includeApplicantAddressHook) {
    addressHooks['applicant-address/:index'] = ({ afterHook }) => {
      afterHook(() => fillSharedAddressAndContinue());
    };
  }

  const pageHooks = {
    ...basePageHooks,
    ...addressHooks,
    ...additionalPageHooks,
  };

  const setupPerTest = useAuth
    ? () => setupForAuth({ prefill })
    : () => setupBasicTest();

  return createTestConfig(
    {
      fixtures: { data: path.join(__dirname, '../fixtures/data') },
      dataPrefix: 'data',
      dataSets,
      pageHooks,
      setupPerTest,
    },
    manifest,
    formConfig,
  );
};
