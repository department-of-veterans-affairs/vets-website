import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import mockFileUpload from '../../../shared/tests/e2e/fixtures/mocks/file-input.json';
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
      [pagePaths.fileInput]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(() => {
            cy.fillVaFileInput('root_wcv3FileInput', {});
            // set the additional info
            cy.get('va-file-input')
              .find('va-select')
              .then($el => {
                cy.selectVaSelect($el, 'public');
              });
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
        });
      },
      [pagePaths.fileInputMultiple]: ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(() => {
            cy.fillVaFileInputMultiple('root_wcv3FileInputMultiple', {});
            cy.get('va-file-input-multiple')
              .shadow()
              .find('va-file-input')
              .first()
              .find('va-select')
              .then($el => {
                cy.selectVaSelect($el, 'public');
              });
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
      cy.intercept(
        'POST',
        formConfig.chapters.fileInput.pages.fileInput.uiSchema.wcv3FileInput[
          'ui:options'
        ].fileUploadUrl,
        mockFileUpload,
      );
      cy.intercept(
        'POST',
        formConfig.chapters.fileInputMultiple.pages.fileInputMultiple.uiSchema
          .wcv3FileInputMultiple['ui:options'].fileUploadUrl,
        mockFileUpload,
      );
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
