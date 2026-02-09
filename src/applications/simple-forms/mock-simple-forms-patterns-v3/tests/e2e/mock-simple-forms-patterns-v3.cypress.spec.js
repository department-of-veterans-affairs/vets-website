import path from 'path';

import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';

function addFile(option) {
  cy.fillVaFileInputMultiple('root_supportingDocuments', {});

  cy.get('va-file-input-multiple')
    .shadow()
    .find('va-file-input')
    .should('exist');

  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(5000);

  cy.get('va-file-input-multiple').then($el => {
    const vaFileInput = $el[0].shadowRoot.querySelector('va-file-input');
    const vaSelect = vaFileInput.querySelector('va-select');
    cy.wrap(vaSelect).then($select => {
      // sometimes vaSelect is null due to CI race conditions
      if (vaSelect) {
        cy.selectVaSelect($select, option);
      }
    });
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
        afterHook(() => addFile('private'));
      },
      'treatment-records/:index/supporting-documents': ({ afterHook }) => {
        afterHook(() => addFile('xray'));
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
