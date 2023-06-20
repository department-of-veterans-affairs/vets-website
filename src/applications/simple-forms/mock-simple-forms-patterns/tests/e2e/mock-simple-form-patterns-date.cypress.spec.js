import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import { fillDateWebComponentPattern } from '../../../shared/tests/e2e/helpers';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

import pagePaths from './pagePaths';

const testPagePath = `${manifest.rootUrl}/${pagePaths.date}`;

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.visit(testPagePath);
        });
      },
      [pagePaths.date]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(async () => {
          cy.get('@testData').then(data => {
            // web components
            // v1
            const [year, month, day] = data.dateWC.split('-');
            cy.get(`va-memorable-date[name="root_dateWC"]`)
              .shadow()
              .find('va-text-input.input-month')
              .shadow()
              .find('input')
              .type(month)
              .then(() => {
                cy.get(`va-memorable-date[name="root_dateWC"]`)
                  .shadow()
                  .find('va-text-input.input-day')
                  .shadow()
                  .find('input')
                  .type(day)
                  .then(() => {
                    cy.get(`va-memorable-date[name="root_dateWC"]`)
                      .shadow()
                      .find('va-text-input.input-year')
                      .shadow()
                      .find('input')
                      .type(year);
                  });
              });

            // v3
            fillDateWebComponentPattern('dateWCV3', data.dateWCV3);

            cy.axeCheck();
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
    },
    // TODO: memorable date web component has a bug where it sometimes
    // can't select the next field
    skip: true,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
