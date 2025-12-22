import path from 'path';

import testForm from '~/platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from '~/platform/testing/e2e/cypress/support/form-tester/utilities';

import maximalJson from './fixtures/data/maximal-test.json';
import formConfig from '../config/form';
import manifest from '../manifest.json';

import { daysAgoYyyyMmDd } from '../../utils/helpers';

const mockManifest = {
  appName: manifest.appName,
  entryFile: manifest.entryFile,
  entryName: manifest.entryName,
  productId: manifest.productId,
  rootUrl: manifest.rootUrl,
};

const { institutionDetails, certifyingOfficial, programs } = maximalJson.data;

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    dataSets: ['maximal-test'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('[class="schemaform-start-button"]')
            .first()
            .click();
        });
      },
      '/school-administrators/85-15-rule-enrollment-ratio/identifying-details-1': ({
        afterHook,
      }) => {
        afterHook(() => {
          const termStartDate = daysAgoYyyyMmDd(10);
          const dateOfCalculations = daysAgoYyyyMmDd(10);

          cy.fillVaTextInput(
            'root_institutionDetails_facilityCode',
            institutionDetails.facilityCode,
          );
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(1000);
          cy.fillVaMemorableDate(
            'root_institutionDetails_termStartDate',
            termStartDate,
            true,
          );
          cy.repeatKey('Tab', 1);
          cy.fillVaMemorableDate(
            'root_institutionDetails_dateOfCalculations',
            dateOfCalculations,
            true,
          );
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/85-15-rule-enrollment-ratio/85/15-calculations/0': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.fillPage();
          cy.fillVaTextInput('root_fte_supported', programs[0].fte.supported);
          cy.fillVaTextInput(
            'root_fte_nonSupported',
            programs[0].fte.nonSupported,
          );
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/85-15-rule-enrollment-ratio/review-and-submit': ({
        afterHook,
      }) => {
        afterHook(() => {
          cy.get('[id="inputField"]', { timeout: 10000 }).type(
            `${certifyingOfficial.first} ${certifyingOfficial.last}`,
            {
              force: true,
            },
          );
          cy.get('[id="checkbox-element"]').check({ force: true });

          cy.tabToSubmitForm();
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/gi/institutions/*', {
        data: {
          attributes: {
            name: 'INSTITUTE OF TESTING',
            facilityCode: '10002000',
            type: 'FOR PROFIT',
            city: 'SAN FRANCISCO',
            state: 'CA',
            zip: '13579',
            country: 'USA',
            address1: '123 STREET WAY',
          },
        },
      });

      cy.intercept('POST', formConfig.submitUrl);
    },
  },
  mockManifest,
  formConfig,
);

testForm(testConfig);
