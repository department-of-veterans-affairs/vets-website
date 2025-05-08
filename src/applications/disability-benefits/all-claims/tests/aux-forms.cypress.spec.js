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

    // 'full-781-781a-8940-test.json' moved to long-ptsd.cypress.spec.js
    // to help balance out CI
    dataSets: [
      'minimal-skip-781.json',
      'upload-781-781a-8940-test.json',
      'secondary-new-test.json',
    ],

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
