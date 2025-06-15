import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
// import mockSubmit from './fixtures/data/mocks/application-submit.json';
import { daysAgoYyyyMmDd } from '../../10215/helpers';
import formConfig from '../config/form';

const mockManifest = {
  appName: '35% exemption of the routine reporting',
  entryFile: './app-entry.jsx',
  entryName: '10216-edu-benefits',
  productId: 'db0db964-89ef-4e80-a469-499b7db330cd',
  rootUrl: '/school-administrators/35-percent-exemption',
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    dataSets: ['maximal-test.json'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          // cy.get('a.va-link--primary')
          cy.get('[class="schemaform-start-button"]')
            .first()
            .click();
        });
      },
      '/school-administrators/85-15-rule-enrollment-ratio/identifying-details-1': ({
        afterHook,
      }) => {
        afterHook(() => {
          const termStartDate = daysAgoYyyyMmDd(15);
          cy.fillVaTextInput(
            'root_institutionDetails_facilityCode',
            '15012020',
          );
          cy.fillVaMemorableDate(
            'root_institutionDetails_termStartDate',
            termStartDate,
            true,
          );
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/85-15-rule-enrollment-ratio/35-percent-exemption/student-ratio-calculation': ({
        afterHook,
      }) => {
        afterHook(() => {
          const dateOfCalculation = daysAgoYyyyMmDd(15);
          cy.fillVaMemorableDate(
            'root_studentRatioCalcChapter_dateOfCalculation',
            dateOfCalculation,
            true,
          );
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/35-percent-exemption/review-and-submit': ({
        afterHook,
      }) => {
        afterHook(() => {
          // cy.get('@testKey').then(testKey => {
          cy.get('[id="inputField"]', { timeout: 10000 }).type('John Doe', {
            force: true,
          });
          cy.get('[id="checkbox-element"]').check({ force: true });

          cy.findByText(/Continue/i, { selector: 'button' }).click();
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('POST', formConfig.submitUrl);
    },
    skip: Cypress.env('CI'),
  },
  mockManifest,
  formConfig,
);

testForm(testConfig);
