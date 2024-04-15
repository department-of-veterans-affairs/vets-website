import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import mockUser from './fixtures/mocks/mock-user';
import mockPrefill from './fixtures/mocks/mock-prefill.json';
import featureToggles from './fixtures/mocks/mock-features.json';
import { MOCK_ENROLLMENT_RESPONSE } from '../../utils/constants';
import {
  fillAddressWebComponentPattern,
  selectYesNoWebComponent,
  goToNextPage,
} from './helpers';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['maximal-test', 'minimal-test'],
    fixtures: { data: path.join(__dirname, 'fixtures/data') },

    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.get('[href="#start"]')
            .first()
            .click();
        });
      },
      'veteran-information/mailing-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            selectYesNoWebComponent(
              'view:doesMailingMatchHomeAddress',
              data['view:doesMailingMatchHomeAddress'],
            );
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
      'veteran-information/home-address': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const fieldName = 'veteranHomeAddress';
            const fieldData = data.veteranHomeAddress;
            fillAddressWebComponentPattern(fieldName, fieldData);
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
      'household-information/spouse-contact-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            const fieldName = 'spouseAddress';
            const fieldData =
              data['view:spouseContactInformation'].spouseAddress;
            fillAddressWebComponentPattern(fieldName, fieldData);
            cy.injectAxeThenAxeCheck();
            goToNextPage();
          });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-checkbox[name="privacyAgreementAccepted"]')
            .scrollIntoView()
            .shadow()
            .find('label')
            .click();
          cy.findByText(/submit/i, { selector: 'button' }).click();
        });
      },
    },

    setupPerTest: () => {
      // Log in if the form requires an authenticated session.
      cy.login(mockUser);
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles).as(
        'mockFeatures',
      );
      cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
        statusCode: 200,
        body: MOCK_ENROLLMENT_RESPONSE,
      }).as('mockEnrollmentStatus');
      cy.intercept('/v0/in_progress_forms/10-10EZR', {
        statusCode: 200,
        body: mockPrefill,
      }).as('mockSip');
      cy.intercept('POST', formConfig.submitUrl, {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: '2023-11-01',
      }).as('mockSubmit');
    },

    useWebComponentFields: true,
  },
  manifest,
  formConfig,
);

testForm(testConfig);
