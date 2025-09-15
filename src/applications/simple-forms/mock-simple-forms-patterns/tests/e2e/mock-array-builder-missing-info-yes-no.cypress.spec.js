import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../../../shared/tests/e2e/fixtures/mocks/feature-toggles.json';
import mockSubmit from '../../../shared/tests/e2e/fixtures/mocks/application-submit.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import pagePaths from './pagePaths';
import user from './fixtures/mocks/user.json';
import sipGetMissingInfoYesNo from './fixtures/mocks/sip-get-missing-info-yes-no.json';
import sipPut from './fixtures/mocks/sip-put.json';

const testConfig = createTestConfig(
  {
    useWebComponentFields: true,
    dataPrefix: 'data',
    dataSets: ['arrayBuilderMissingInfoYesNo'],
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

              cy.get(
                'va-card[name="employer_1"] .array-builder-missing-info-alert',
              ).should('exist');
            };

            const tryContinueAndShouldBeStoppedByError = () => {
              // Remove wait after the following issue is fixed.
              // https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/4469
              // Wait required to avoid race condition with SIP causing page rerender.
              // eslint-disable-next-line cypress/no-unnecessary-waiting
              cy.wait(100);
              cy.findByText(/continue/i, { selector: 'button' }).click();
              // Missing info alert should be focused
              cy.get(
                'va-card[name="employer_1"] .array-builder-missing-info-alert',
              ).should('have.attr', 'tabindex', '-1');
            };

            const deleteCard = () => {
              // Remove card with error and should be able to continue
              cy.get(
                'va-card[name="employer_1"] [data-action="remove"]',
              ).click();

              cy.get('va-modal[status="warning"]')
                .shadow()
                .get('.va-modal-alert-body va-button')
                .first()
                .click();

              cy.get('va-card').should('have.length', 1);
            };

            const continueNoError = () => {
              cy.selectYesNoVaRadioOption('root_view:hasEmployment', false);
              cy.findByText(/continue/i, { selector: 'button' }).click();
            };

            expectInitialLayout();
            tryContinueAndShouldBeStoppedByError();
            deleteCard();
            continueNoError();
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
        sipGetMissingInfoYesNo,
      );
      cy.login(user);
    },
    skip: false,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
// this is a comment
