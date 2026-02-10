import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { getConfig } from './utils';

const testConfig = getConfig(['medicare']);
testForm(testConfig);
