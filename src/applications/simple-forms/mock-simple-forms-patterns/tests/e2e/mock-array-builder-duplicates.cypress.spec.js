import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import pagePaths from './pagePaths';
import user from './fixtures/mocks/user.json';
import sipGetDuplicates from './fixtures/mocks/sip-get-duplicates.json';
import sipPut from './fixtures/mocks/sip-put.json';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['arrayBuilderDuplicates'],
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-button[text*="continue"]').click();
        });
      },
      'chapter-select': ({ afterHook }) => {
        afterHook(() => {
          cy.get(`va-button[text="Deselect all"]`).click();
          cy.selectVaCheckbox('root_chapterSelect_arrayMultiPageBuilder', true);
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
      [pagePaths.arrayMultiPageBuilderSummary]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(() => {
            const expectInitialLayout = () => {
              cy.get('va-card').should('have.length', 2);

              cy.get('va-card[name="employer_1"]').should('exist');
            };

            const editCardAndTestModal = button => {
              const editLink = button === 'first' ? '2' : '1';
              /* Sequence:
               * - Initial edit of second card
               * - Modify employer name to create a duplicate
               * - A duplicate modal opens on continue.
               * - When canceling, a warning appears on the summary page.
               * - The second edit, we're editing the first card (for simplicity)
               * - Make the same edit (again simplicity)
               * - On continue, the modal opens
               * - This time we save and continue
               * - Upon return to the summary page, there is now an "info" alert
               */
              cy.get(`va-link[label="Edit test ${editLink}"]`).click();

              cy.url().should('contain', '/name-and-address?edit=true');
              // eslint-disable-next-line cypress/no-unnecessary-waiting
              cy.wait(1000);

              // Change name of second card to create a duplicate
              cy.fillVaTextInput('root_name', 'Test 1');

              cy.get('va-button[continue]').click();

              // Cancel from modal - returns to summary page with edited changes
              // in place. This needs to be fixed.
              cy.get('va-modal[status="warning"]')
                .shadow()
                .find('.va-modal-alert-body')
                .should('contain', 'Is this a duplicate?');

              cy.get('va-modal[status="warning"]')
                .shadow()
                .find('.va-modal-alert-body va-button')
                [button]()
                .click();
            };

            const checkSummaryAlerts = round => {
              if (round === 'first') {
                cy.get(
                  `va-card[name="employer_1"] va-alert[status="warning"]`,
                ).should(
                  'contain',
                  'You have entered multiple employers with the same name and address.',
                );
              } else {
                cy.get(
                  `va-card[name="employer_1"] va-alert[status="info"]`,
                ).should(
                  'contain',
                  'You may have multiple employers with this same information.',
                );
              }
            };

            expectInitialLayout();

            // Cancel from modal & summary page warning alert
            editCardAndTestModal('first');
            checkSummaryAlerts('first');

            editCardAndTestModal('last'); // Accept duplicate from modal
            cy.get('va-button[continue]').click(); // navigate past employer dates
            checkSummaryAlerts('last'); // Summary page info alert

            // Should be able to submit with duplicates
            cy.clickFormContinue();
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      cy.intercept(
        'PUT',
        '/v0/in_progress_forms/FORM_MOCK_SF_PATTERNS',
        sipPut,
      );
      cy.intercept(
        'GET',
        '/v0/in_progress_forms/FORM_MOCK_SF_PATTERNS',
        sipGetDuplicates,
      );
      cy.login(user);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
