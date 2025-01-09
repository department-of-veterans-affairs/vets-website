import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockEnrollmentStatus from './fixtures/mocks/enrollment-status.json';
import mockFacilities from './fixtures/mocks/facilities.json';
import featureToggles from './fixtures/mocks/feature-toggles.json';
import mockSubmission from './fixtures/mocks/submission.json';
import {
  acceptPrivacyAgreement,
  fillIdentityForm,
  fillVaFacility,
  goToNextPage,
} from './utils';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['maximal-test', 'minimal-test', 'foreign-address-test'],
    fixtures: { data: path.join(__dirname, 'fixtures/data') },
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('.schemaform-start-button')
            .first()
            .click();
        });
      },
      'id-form': () => {
        cy.get('@testData').then(data => {
          fillIdentityForm(data);
        });
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
          cy.get('@testData').then(() => {
            cy.selectRadio('root_view:reportDependents', 'N');
            goToNextPage();
          });
        });
      },
      'insurance-information/va-facility-api': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            fillVaFacility(data['view:preferredFacility']);
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
    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('POST', '/v0/health_care_applications', mockSubmission);
      cy.intercept(
        'GET',
        '/v0/health_care_applications/enrollment_status*',
        mockEnrollmentStatus,
      );
      cy.intercept(
        'GET',
        '/v0/health_care_applications/facilities?*',
        mockFacilities,
      ).as('getFacilities');
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
