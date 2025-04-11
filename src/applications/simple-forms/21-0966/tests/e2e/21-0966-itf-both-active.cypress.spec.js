import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import mockUser from './fixtures/mocks/user.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['veteran-both-active-maximal-test'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByText(/^start your intent to file/i, {
            selector: 'a',
          }).click({ force: true });
        });
      },
      [formConfig.additionalRoutes[0].path]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {});
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '**/get_intents_to_file', {
        compensationIntent: {
          expirationDate: '2025-01-30T17:56:30.512Z',
          status: 'active',
        },
        pensionIntent: {
          expirationDate: '2025-01-30T17:56:30.512Z',
          status: 'active',
        },
      });
      cy.intercept('GET', '/v0/user', mockUser);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);

      cy.login(mockUser);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
