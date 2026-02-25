import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import mockPrefill from './fixtures/mocks/prefill.inProgress.ohi.json';
import { getConfig } from './utils';

const testConfig = getConfig({
  dataSets: ['ohi.health-insurance'],
  prefill: mockPrefill,
  useAuth: true,
});

testForm(testConfig);
