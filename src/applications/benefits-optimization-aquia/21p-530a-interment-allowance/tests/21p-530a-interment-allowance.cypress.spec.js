import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '@bio-aquia/21p-530a-interment-allowance/config/form';
import manifest from '@bio-aquia/21p-530a-interment-allowance/manifest.json';
import mockUser from './fixtures/mocks/user.json';

// Helper for date component fillings
export const fillDateWebComponentPattern = (fieldName, value) => {
  if (typeof value !== 'undefined') {
    const [year, month, day] = value.split('-');

    if (navigator.userAgent.includes('Chrome')) {
      cy.get(`va-memorable-date[name="root_${fieldName}"]`)
        .shadow()
        .find('va-select.usa-form-group--month-select')
        .shadow()
        .find('select')
        .as('field');

      cy.get('@field')
        .select(parseInt(month, 10))
        .realPress('Tab')
        .realType(day)
        .realPress('Tab')
        .realType(year);
    } else {
      cy.get(`va-memorable-date[name="root_${fieldName}"]`)
        .shadow()
        .find('va-select.usa-form-group--month-select')
        .shadow()
        .find('select')
        .as('month');
      cy.get('@month')
        .select(parseInt(month, 10))
        .then(() => {
          cy.get(`va-memorable-date[name="root_${fieldName}"]`)
            .shadow()
            .find('va-text-input.usa-form-group--day-input')
            .shadow()
            .find('input')
            .as('day');
          cy.get('@day')
            .type(day)
            .then(() => {
              cy.get(`va-memorable-date[name="root_${fieldName}"]`)
                .shadow()
                .find('va-text-input.usa-form-group--year-input')
                .shadow()
                .find('input')
                .type(year);
            });
        });
    }
  }
};

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataDir: path.join(__dirname, 'fixtures', 'data'),
    dataSets: ['minimal-test', 'maximal-test'],
    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', mockUser);
      cy.intercept('POST', formConfig.submitUrl, { status: 200 });
      cy.login(mockUser);
    },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          // VaLinkAction
          cy.get('[data-testid="start-burial-allowance-link"]').click();
        });
      },
      // Not sure why the date page wasn't playing nice.
      'service-periods/:index/dates': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const { dateEnteredService, dateLeftService } = data.periods[0];
            if (dateEnteredService) {
              fillDateWebComponentPattern(
                'dateEnteredService',
                dateEnteredService,
              );
            }
            if (dateLeftService) {
              fillDateWebComponentPattern('dateLeftService', dateLeftService);
            }
            cy.clickFormContinue();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const {
              signature,
              titleOfStateOrTribalOfficial,
            } = data?.certification;
            cy.get('va-text-input[name="organizationTitle"]')
              .shadow()
              .find('input')
              .type(titleOfStateOrTribalOfficial);
            cy.get('#veteran-signature')
              .shadow()
              .find('input')
              .first()
              .type(signature);
            cy.get(`va-statement-of-truth`)
              .shadow()
              .find('va-checkbox')
              .shadow()
              .find('input')
              .check({ force: true });
            cy.clickFormContinue();
          });
        });
      },
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
