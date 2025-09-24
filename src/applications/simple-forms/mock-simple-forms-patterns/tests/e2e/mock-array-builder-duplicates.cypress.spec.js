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
          cy.clickFormContinue();
        });
      },
      [pagePaths.arrayMultiPageBuilderSummary]: ({ afterHook }) => {
        cy.injectAxeThenAxeCheck();
        afterHook(() => {
          cy.get('@testData').then(data => {
            const expectInitialLayout = () => {
              cy.get('va-card').should('have.length', 2);

              cy.get('va-card[name="employer_1"]').should('exist');
            };

            const editCard = (edit, name) => {
              /* Sequence:
               * - Initial edit of second card
               * - Modify employer name to create a duplicate
               * - A duplicate modal opens on continue.
               * - When canceling, a warning appears on the summary page.
               * - The second edit, we're editing the first card (for simplicity)
               * - Make the same edit (again, for simplicity)
               * - On continue, the modal opens
               * - This time we save and continue
               * - Upon return to the summary page, there is now an "info" alert
               * - Submit form & get to confirmation page
               */
              cy.get(`va-link[label="Edit test ${edit}"]`)
                .first()
                .click();

              cy.url().should('contain', '/name-and-address?edit=true');
              // eslint-disable-next-line cypress/no-unnecessary-waiting
              cy.wait(100);

              // Change name of second card to create a duplicate
              cy.fillVaTextInput('root_name', name || 'test 1');

              cy.get('va-button[continue]').click();
            };

            const addNewDuplicate = () => {
              cy.selectVaRadioOption('root_view:hasEmployment', 'Y');
              cy.clickFormContinue();

              cy.fillVaTextInput('root_name', 'test 3');
              const { address } = data.employers[0];
              cy.fillVaTextInput('root_address_city', address.city);
              cy.selectVaSelect('root_address_country', address.country);
              cy.fillVaTextInput('root_address_street', address.street);
              cy.selectVaSelect('root_address_state', address.state);
              cy.fillVaTextInput('root_address_postalCode', '99999');
              cy.clickFormContinue();
            };

            const checkFormDataUpdate = () => {
              cy.clickFormBack();
              cy.get('va-text-input[name="root_address_postalCode"]')
                .shadow()
                .find('input')
                .should('have.value', '99999');
              cy.get('va-button[data-action="cancel"]').click();
            };

            const testModal = (button, text) => {
              // Cancel from modal - returns to summary page with edited changes
              // in place. This needs to be fixed.
              cy.get('va-modal[status="warning"]')
                .shadow()
                .find('.va-modal-alert-body')
                .should('contain', text || 'Potential duplicate');

              cy.get('va-modal[status="warning"]')
                .shadow()
                .find('.va-modal-alert-body va-button')
                [button]()
                .click();
            };

            expectInitialLayout();

            // *** Test modal & cancel return to summary page
            editCard('2');
            // Cancel from modal & summary page warning alert
            testModal('first');
            cy.get(
              `va-card[name="employer_1"] va-alert[status="warning"]`,
            ).should(
              'contain',
              'You have entered multiple employers with the same name and address.',
            );

            // ** Test modal & accept duplicate; after return to summary page,
            // warning is replaced with info alert
            editCard('1'); // Accept duplicate from modal
            testModal('last');
            // navigate past employer dates
            cy.get('va-button[continue]').click();
            cy.get(`va-card[name="employer_1"] va-alert[status="info"]`).should(
              'contain',
              'You may have multiple employers with this same information.',
            );

            // ** Test external duplicate check on date page
            editCard('1', 'test 3');
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(100);
            // Match external comparison data: test 3 with 1997-01-03 from date
            cy.fillVaMemorableDate('root_dateRange_from', '1997-01-03');

            cy.get('va-button[continue]').click();
            testModal('first', 'Potential duplicate');
            cy.get(`va-card va-alert`).should('not.exist');

            // ** Test new item data is saved to formData after accepting
            // ** duplicate and navigating to the next page after the modal
            cy.selectVaRadioOption('root_view:hasEmployment', 'Y');
            addNewDuplicate();
            testModal('last');
            checkFormDataUpdate();
            testModal('first', 'Cancel');

            // Should be able to submit
            cy.selectVaRadioOption('root_view:hasEmployment', 'N');
            cy.clickFormContinue();
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
