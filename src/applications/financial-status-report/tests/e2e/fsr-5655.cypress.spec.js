import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mockUser.json';
import debts from './fixtures/mocks/debts.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['positiveResponse'],
    fixtures: {
      data: path.join(__dirname, 'fixtures', 'data'),
    },
    setupPerTest: () => {
      cy.login(mockUser);
      cy.intercept('GET', '/v0/debts', debts);

      // cy.get('@testData').then(testData => {
      //   cy.intercept('GET', '/v0/in_progress_forms/5655', testData);
      //   cy.intercept('PUT', 'v0/in_progress_forms/5655', testData);
      // });
    },
    pageHooks: {
      introduction: () => {
        // click the start button
        cy.findAllByText(/start/i, { selector: 'button' })
          .first()
          .click();
      },
    },
    // skip: true, // disable test until FSR is in production
  },
  manifest,
  formConfig,
);

testForm(testConfig);
