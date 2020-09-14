import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

import basicUser from './fixtures/users/user-basic.json';

const testConfig = createTestConfig(
  {
    appName: 'healthcare-questionnaire',
    dataSets: ['data'],
    arrayPages: [],
    dataPrefix: '',
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'this-visit'),
      mocks: path.join(__dirname, 'fixtures', 'this-visit'),
    },
    setupPerTest: () => {
      cy.route('GET', '/v0/feature_toggles?*', 'fx:mocks/feature-toggles');
      cy.login(basicUser);
    },
    pageHooks: {
      introduction: ({ afterHook, pathname }) => {
        cy.log(`Look, I'm on ${pathname}!`);
        afterHook(() => {
          cy.findAllByText(/start/i, { selector: 'button' })
            .first()
            .click();
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
