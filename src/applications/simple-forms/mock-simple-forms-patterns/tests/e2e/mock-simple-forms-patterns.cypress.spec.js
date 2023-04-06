import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from './fixtures/mocks/feature-toggles.json';
import mockSubmit from './fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test', 'maximal-test'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findByText(/start/i, { selector: 'button' });
          cy.findByText(/without signing in/i).click({ force: true });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { fullName } = data.veteran;
            cy.get('#veteran-signature')
              .shadow()
              .find('input')
              .first()
              .type(
                fullName.middle
                  ? `${fullName.first} ${fullName.middle} ${fullName.last}`
                  : `${fullName.first} ${fullName.last}`,
              );
            cy.get(`input[name="veteran-certify"]`).check();
            cy.findAllByText(/Submit application/i, {
              selector: 'button',
            }).click();
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', '/forms_api/v1/simple_forms', mockSubmit);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
