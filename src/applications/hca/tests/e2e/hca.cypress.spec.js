import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';

import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import featureToggles from './fixtures/mocks/feature-toggles.json';
import mockFacilities from './fixtures/mocks/mockFacilities.json';
import mockEnrollmentStatus from './fixtures/mocks/mockEnrollmentStatus.json';

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
          cy.findByLabelText(/first name/i).type(data.veteranFullName.first);
          cy.findByLabelText(/last name/i).type(data.veteranFullName.last);

          const [year, month, day] = data.veteranDateOfBirth
            .split('-')
            .map(dateComponent => parseInt(dateComponent, 10).toString());
          cy.findByLabelText(/month/i).select(month);
          cy.findByLabelText(/day/i).select(day);
          cy.findByLabelText(/year/i).type(year);

          cy.findByLabelText(/social security/i).type(
            data.veteranSocialSecurityNumber,
          );
        });
      },
      'insurance-information/va-facility-api': ({ afterHook }) => {
        afterHook(() => {
          cy.fillPage();
          cy.wait('@getFacilities');
          cy.get('[name="root_view:preferredFacility_vaMedicalFacility"]')
            .shadow()
            .find('select')
            .select('631');
          cy.get('.usa-button-primary').click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('[name="privacyAgreementAccepted"]')
            .scrollIntoView()
            .shadow()
            .find('[type="checkbox"]')
            .check();
          cy.findByText(/submit/i, { selector: 'button' }).click();
        });
      },
    },

    setupPerTest: () => {
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('GET', '/v1/facilities/va?*', mockFacilities).as(
        'getFacilities',
      );
      cy.intercept('POST', '/v0/health_care_applications', {
        formSubmissionId: '123fake-submission-id-567',
        timestamp: '2016-05-16',
      });
      cy.intercept('GET', '/v0/health_care_applications/enrollment_status*', {
        statusCode: 404,
        body: mockEnrollmentStatus,
      });
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
