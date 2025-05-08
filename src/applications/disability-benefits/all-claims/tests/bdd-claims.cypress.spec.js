import path from 'path';

import testForm from '@department-of-veterans-affairs/platform-testing/form-tester';
import { createTestConfig } from '@department-of-veterans-affairs/platform-testing/form-tester/utilities';

import mockUser from './fixtures/mocks/user.json';

import formConfig from '../config/form';
import manifest from '../manifest.json';
import { setup, pageHooks } from './cypress.helpers';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    useWebComponentFields: true,

    dataSets: ['minimal-bdd-test', 'maximal-bdd-test'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },

    pageHooks: pageHooks(cy),
    setupPerTest: () => {
      cy.login(mockUser);
      setup(cy);
    },

    // skip: [],
  },
  manifest,
  formConfig,
);

testForm(testConfig);
