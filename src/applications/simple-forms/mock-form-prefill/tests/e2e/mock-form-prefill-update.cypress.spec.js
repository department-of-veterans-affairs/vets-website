/**
 * E2E test for mock form prefill - Edit Contact Info (form-only update).
 * Tests editing contact info fields that only update the form data,
 * not the VA profile.
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
      'personal-information': ({ afterHook }) => {
        afterHook(() => {
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
      'contact-information': ({ afterHook }) => {
        afterHook(() => {
          cy.get('va-card-status')
            .find('va-link-action')
            .shadow()
            .find('a')
            .contains('Edit mailing address')
            .click();
          // update mailing address in the form only
          cy.fillVaTextInput('root_addressLine1', '456 Edited Street');
          cy.fillVaTextInput('root_city', 'Updated City');
          cy.selectVaSelect('root_stateCode', 'CA');
          cy.fillVaTextInput('root_zipCode', '90210');
          cy.findByLabelText('No, only update this form').click();
          cy.findByTestId('save-edit-button').click();

          cy.findByTestId('confirm-address-button').click();
          cy.url().should('include', 'contact-information');
          cy.findByText(/continue/i, { selector: 'button' }).click();
        });
      },
      'review-and-submit': ({ afterHook }) => {
        afterHook(() => {
          cy.get('@testData').then(data => {
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
      cy.intercept(
        'POST',
        '/v0/profile/address_validation',
        mockAddressValidation,
      );
      cy.intercept('POST', formConfig.submitUrl, mockSubmit);
      cy.login(user);
    },
  },
  manifest,
  formConfig,
);

testForm(testConfig);
