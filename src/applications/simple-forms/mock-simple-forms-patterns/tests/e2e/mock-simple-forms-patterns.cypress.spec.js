import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import { introductionPageFlow } from '../../../shared/tests/e2e/helpers';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import pagePaths from './pagePaths';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['default'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          introductionPageFlow();
        });
      },
      [pagePaths.address]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            // widgets
            cy.fillAddressWebComponentPattern(`wcv3Address`, data.wcv3Address);
            cy.axeCheck();
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(() => {
            cy.findAllByText(/Submit application/i, {
              selector: 'button',
            }).click();
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
