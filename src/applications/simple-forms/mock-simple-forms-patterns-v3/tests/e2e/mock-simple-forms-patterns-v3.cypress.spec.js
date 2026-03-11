import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

function addFile(option, elementName) {
  cy.fillVaFileInputMultiple(elementName, {});

  cy.get('va-file-input-multiple')
    .shadow()
    .find('va-file-input')
    .should('exist');

  // add a wait to ensure additional input has fully rendered and updated before triggering validation
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(1000);

  cy.get('va-file-input-multiple')
    .shadow()
    .find('va-file-input')
    .first()
    .then($fileInput => {
      const $select = $fileInput.find('va-select');
      if ($select.length > 0) {
        cy.selectVaSelect($select[0], option);
      }
    });

  cy.findByText(/continue/i, { selector: 'button' }).click();
}

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['minimal-test'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/Name and Date of birth/i)
            .first()
            .click();
        });
      },
      'upload-file': ({ afterHook }) => {
        afterHook(() => {
          cy.fillVaFileInput('root_uploadedFile', {});
          cy.get('va-file-input')
            .find('va-select')
            .then($el => {
              cy.selectVaSelect($el, 'tax');
            });
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
      'supporting-documents': ({ afterHook }) => {
        afterHook(() => addFile('private', 'root_supportingDocuments'));
      },
      'treatment-records/:index/supporting-documents': ({ afterHook }) => {
        afterHook(() => addFile('xray', 'root_supportingDocuments'));
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
