/**
 * E2E test for mock form prefill.
 */
import path from 'path';
import testForm from 'platform/testing/e2e/cypress/support/form-tester';
import { createTestConfig } from 'platform/testing/e2e/cypress/support/form-tester/utilities';
import featureToggles from '../fixtures/mocks/feature-toggles.json';
import user from '../fixtures/mocks/user.json';
import mockSubmit from '../fixtures/mocks/application-submit.json';
import mockSipGet from '../fixtures/mocks/sip-get.json';
import mockSipPut from '../fixtures/mocks/sip-put.json';
import mockVamcEhr from '../fixtures/mocks/vamc-ehr.json';
import mockProfileStatus from '../fixtures/mocks/profile-status.json';
import mockAddressValidation from '../fixtures/mocks/address-validation.json';
import formConfig from '../../config/form';
import manifest from '../../manifest.json';
import { reviewAndSubmitPageFlow } from './helpers';

const testConfig = createTestConfig(
  {
    dataPrefix: 'data',
    dataSets: ['minimal-test'],
    dataDir: path.join(__dirname, '..', 'fixtures', 'data'),
    pageHooks: {
      introduction: ({ afterHook }) => {
        afterHook(() => {
          cy.findAllByText(/^start/i, { selector: 'a[href="#start"]' })
            .last()
            .click({ force: true });
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
            cy.get('va-button[label="Edit contact information"]').click();

            // update mailing address in the form only
            cy.get('va-link[label="Edit mailing address"]').click();
            cy.fillVaTextInput('root_addressLine1', '456 Edited Street');
            cy.fillVaTextInput('root_city', 'Updated City');
            cy.selectVaSelect('root_stateCode', 'CA');
            cy.fillVaTextInput('root_zipCode', '90210');
            cy.findByLabelText('No, only update this form').click();
            cy.findByTestId('save-edit-button').click();
            cy.findByTestId('confirm-address-button').click();

            // cy.get('va-button[text="Update page"]').click();

            const { fullName } = data;
            reviewAndSubmitPageFlow(fullName, 'Submit application');
          });
        });
      },
    },
    setupPerTest: () => {
      cy.intercept('GET', '/v0/user', user);
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept('GET', '/data/cms/vamc-ehr.json', mockVamcEhr);
      cy.intercept(
        'GET',
        '/v0/in_progress_forms/FORM-MOCK-PREFILL',
        mockSipGet,
      );
      cy.intercept('GET', '/v0/profile/status/', mockProfileStatus);
      cy.intercept(
        'PUT',
        '/v0/in_progress_forms/FORM-MOCK-PREFILL',
        mockSipPut,
      );
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      cy.intercept(
        'POST',
        '/v0/profile/address_validation',
        mockAddressValidation,
      );
      cy.login(user);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
