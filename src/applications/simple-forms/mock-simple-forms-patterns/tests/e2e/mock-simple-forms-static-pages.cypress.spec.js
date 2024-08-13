import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['arrayBuilder'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-button[text*="start"]');
          cy.findAllByText(/without signing in/i)
            .first()
            .click({ force: true });
        });
      },
      'chapter-select': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`va-button[text="Deselect all"]`).click();
          cy.selectVaCheckbox('root_chapterSelect_confirmationPageNew', true);
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
      'confirmation-page-new': ({ afterHook }) => {
        afterHook(() => {
          cy.findByText(
            /Your form has been submitted and is pending processing on/i,
          ).should('exist');
          cy.findByText(/How to contact us if you have questions/i).should(
            'exist',
          );
          // Navigate to confirmation page to stop test successfully
          cy.visit('/mock-simple-forms-patterns/confirmation');
          return () => {};
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
