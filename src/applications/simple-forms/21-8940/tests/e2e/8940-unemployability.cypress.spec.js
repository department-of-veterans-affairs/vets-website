// Cypress E2E tests for 21-8940 Unemployability Form (placeholder)
// Will follow pattern of 4142-medial-release.cypress.spec.js

import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import user from './fixtures/mocks/user.json';
import mockSubmit from '../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

// TODO: Add helpers similar to shared/tests/e2e/helpers if needed

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['minimal-test'], // add 'maximal-test' when fixtures are created
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByText(/start/i).click({ force: true });
        });
      },
      // Add additional page hooks for filling required fields across pages
      'personal-information-1': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.fillTextWebComponent('veteran_fullName_first', data.veteran.fullName.first);
            cy.fillTextWebComponent('veteran_fullName_last', data.veteran.fullName.last);
            cy.fillDateWebComponentPattern('veteran_dateOfBirth', data.veteran.dateOfBirth);
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      cy.login(user);
    },
    skip: true, // set to false when data fixtures & page hooks complete
  },
  manifest,
  formConfig,
);

testForm(testConfig);
