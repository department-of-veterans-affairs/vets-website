import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import minimalFixture from '../schema/minimal-test.json';
import overflowFixture from '../schema/overflow-test.json';

import mockUser from '../fixtures/mocks/user.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

import { pageHooks, setup } from './helpers';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    appName: 'Burials EZ',
    dataPrefix: 'data',
    dataDir: null,
    dataSets: [
      { title: 'overflow', data: overflowFixture },
      { title: 'minimal', data: minimalFixture },
    ],
    pageHooks: pageHooks(cy),
    setupPerTest: () => {
      cy.login(mockUser);
      setup();
      cy.injectAxeThenAxeCheck();
    },

    // skip: [],
  },
  manifest,
  formConfig,
);

testForm(testConfig);
