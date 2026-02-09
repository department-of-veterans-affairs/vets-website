import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { getConfig } from './utils';

const testConfig = getConfig({
  dataSets: ['veteran'],
  includeApplicantAddressHook: true,
});

testForm(testConfig);
