import path from 'path';

import testForm from '@department-of-veterans-affairs/platform-testing/form-tester';
import { createTestConfig } from '@department-of-veterans-affairs/platform-testing/form-tester/utilities';

import mockUser from './fixtures/mocks/user.json';
import formConfig from '../config/form';
import manifest from '../manifest.json';
import { setup, pageHooks } from './cypress.helpers';

const prefillData = {
  startedFormVersion: '2022',
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataSets: ['maximal-toxic-exposure-test'],

    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },

    pageHooks: pageHooks(cy, { prefillData }),
    setupPerTest: () => {
      cy.login(mockUser);
      setup(cy, { prefillData });
    },

    useWebComponentFields: true,

    // skip: [],
  },
  manifest,
  formConfig,
);

testForm(testConfig);
