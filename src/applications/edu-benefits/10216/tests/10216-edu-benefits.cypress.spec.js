import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

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

const {
  institutionDetails,
  studentRatioCalcChapter,
  certifyingOfficial,
} = maximalJson.data;

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',

    dataDir: path.join(__dirname, 'fixtures', 'data'),

    dataSets: ['maximal-test.json'],

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('[class="schemaform-start-button"]')
            .first()
            .click();
        });
      },
      '/school-administrators/35-percent-exemption/identifying-details-1': ({
        afterHook,
      }) => {
        afterHook(() => {
          const termStartDate = daysAgoYyyyMmDd(15);

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
          cy.tabToSubmitForm();
        });
      },
      '/school-administrators/35-percent-exemption/student-ratio-calculation': ({
        afterHook,
      }) => {
        afterHook(() => {
          const dateOfCalculation = daysAgoYyyyMmDd(15);

          cy.fillVaTextInput(
            'root_studentRatioCalcChapter_beneficiaryStudent',
            studentRatioCalcChapter.beneficiaryStudent,
          );
          cy.fillVaTextInput(
            'root_studentRatioCalcChapter_numOfStudent',
            studentRatioCalcChapter.numOfStudent,
          );
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
