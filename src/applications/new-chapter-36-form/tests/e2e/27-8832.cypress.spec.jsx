import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import user from '../fixtures/mocks/user.json';
import submit from '../fixtures/mocks/submit.json';
import featureToggles from '../fixtures/mocks/featureToggles.json';
import minimalFlow from '../fixtures/data/minimal-flow.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: null,
    dataSets: [{ title: 'minimalFlow', data: minimalFlow }],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.injectAxeThenAxeCheck();
          cy.get('a.vads-c-action-link--green').click();
        });
      },
      'name-and-date-of-birth': ({ afterHook }) => {
        afterHook(() => {
          cy.injectAxeThenAxeCheck();
          cy.get('@testData').then(() => {
            cy.fillPage();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'review-and-submit': () => {
        cy.injectAxeThenAxeCheck();
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', user);
      cy.intercept('/v0/feature_toggles*', featureToggles);
      cy.intercept('POST', '/v0/veteran_readiness_employment_claims', submit);
      cy.login(user);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
