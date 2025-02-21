import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import {
  acceptPrivacyAgreement,
  fillIdentityForm,
  fillVaFacility,
  goToNextPage,
  // setupBasicTest,
  setupForAuth,
  startAsAuthUser,
  // startAsGuestUser,
} from './utils';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['maximal-test', 'minimal-test', 'foreign-address-test'],
    fixtures: { data: path.join(__dirname, 'fixtures/data') },
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => startAsAuthUser());
      },
      'id-form': () => {
        cy.get('@testData').then(testData => fillIdentityForm(testData));
      },
      'household-information/share-financial-information': ({ afterHook }) => {
        afterHook(() => {
          cy.selectRadio('root_discloseFinancialInformation', 'N');
          goToNextPage();
        });
      },
      'household-information/share-financial-information-confirm': ({
        afterHook,
      }) => {
        afterHook(() => goToNextPage());
      },
      'household-information/marital-status': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[name="root_maritalStatus"]').select('Never Married');
          goToNextPage();
        });
      },
      'household-information/dependents': ({ afterHook }) => {
        afterHook(() => {
          cy.selectRadio('root_view:reportDependents', 'N');
          goToNextPage();
        });
      },
      'insurance-information/va-facility-api': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(testData => {
            fillVaFacility(testData['view:preferredFacility']);
            goToNextPage();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          acceptPrivacyAgreement();
          cy.findByText(/submit/i, { selector: 'button' }).click();
        });
      },
    },
    setupPerTest: () => setupForAuth(),
  },
  manifest,
  formConfig,
);

testForm(testConfig);
