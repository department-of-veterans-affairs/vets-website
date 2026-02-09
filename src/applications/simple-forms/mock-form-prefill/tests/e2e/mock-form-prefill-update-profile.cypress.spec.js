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
import mockProfileTelephones from '../fixtures/mocks/profile-telephones.json';
import mockProfileAddresses from '../fixtures/mocks/profile-addresses.json';
import mockProfileEmailAddresses from '../fixtures/mocks/profile-email-addresses.json';
import mockProfileAddressTransaction from '../fixtures/mocks/profile-address-transaction.json';
import mockProfileTelephoneTransaction from '../fixtures/mocks/profile-telephone-transaction.json';
import mockProfileEmailTransaction from '../fixtures/mocks/profile-email-transaction.json';
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
          cy.get('@userDataUpdater').then(updater => {
            // Create a deep clone of user data for updates
            const newUserData = JSON.parse(JSON.stringify(user.data));

            // Update mailing address in profile
            cy.get('va-link[label="Edit mailing address"]').click();
            cy.fillVaTextInput('root_addressLine1', '456 Edited Street');
            cy.fillVaTextInput('root_city', 'Updated City');
            cy.selectVaSelect('root_stateCode', 'CA');
            cy.fillVaTextInput('root_zipCode', '90210');
            cy.findByLabelText('Yes, also update my profile').click();

            // Update the mock data
            newUserData.attributes.vet360ContactInformation.mailingAddress.addressLine1 =
              '456 Edited Street';
            newUserData.attributes.vet360ContactInformation.mailingAddress.city =
              'Updated City';
            newUserData.attributes.vet360ContactInformation.mailingAddress.stateCode =
              'CA';
            newUserData.attributes.vet360ContactInformation.mailingAddress.zipCode =
              '90210';
            updater.setUserData(newUserData);

            cy.findByTestId('save-edit-button').click();
            cy.findByTestId('confirm-address-button').click();

            // Update home phone number in profile
            cy.get('va-link[label="Edit home phone number"]').click();
            cy.fillVaTextInput('root_inputPhoneNumber', '2101234567');

            // Update the mock data
            newUserData.attributes.vet360ContactInformation.homePhone.areaCode =
              '210';
            newUserData.attributes.vet360ContactInformation.homePhone.phoneNumber =
              '1234567';
            updater.setUserData(newUserData);

            cy.findByTestId('save-edit-button').click();

            // Update mobile phone number in profile
            cy.get('va-link[label="Edit mobile phone number"]').click();
            cy.fillVaTextInput('root_inputPhoneNumber', '2109876543');

            // Update the mock data
            newUserData.attributes.vet360ContactInformation.mobilePhone.areaCode =
              '210';
            newUserData.attributes.vet360ContactInformation.mobilePhone.phoneNumber =
              '9876543';
            updater.setUserData(newUserData);

            cy.findByTestId('save-edit-button').click();

            // Update email address in profile
            cy.get('va-link[label="Edit email address"]').click();
            cy.fillVaTextInput(
              'root_emailAddress',
              'mitchell.jenkins.test1@gmail.com',
            );

            // Update the mock data
            newUserData.attributes.vet360ContactInformation.email.emailAddress =
              'mitchell.jenkins.test1@gmail.com';
            updater.setUserData(newUserData);

            cy.findByTestId('save-edit-button').click();
            cy.url().should('include', 'contact-information');
            cy.findByText(/continue/i, { selector: 'button' }).click();
          });
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
      // Store updated user data in a closure
      let updatedUserData = null;

      cy.intercept('GET', '/v0/user', user);
      cy.intercept('GET', '/v0/feature_toggles?*', featureToggles);
      cy.intercept(
        'GET',
        '/v0/in_progress_forms/FORM-MOCK-PREFILL',
        mockSipGet,
      );

      // Dynamically return either original or updated user data
      cy.intercept('GET', '/v0/user?now=*', req => {
        req.reply({
          data: updatedUserData || user.data,
          meta: {
            errors: [],
          },
        });
      }).as('mockUserUpdated');

      // Store the updater function so we can modify userData later
      cy.wrap({
        setUserData: newData => {
          updatedUserData = newData;
        },
      }).as('userDataUpdater');

      cy.intercept('GET', '/data/cms/vamc-ehr.json', mockVamcEhr);
      cy.intercept('GET', '/v0/profile/status/', mockProfileStatus);
      cy.intercept(
        'GET',
        '/v0/profile/status/6a03b50c-c2f2-47f1-b6d1-90fc73f63ed7',
        mockProfileAddressTransaction,
      );
      cy.intercept(
        'GET',
        '/v0/profile/status/c2a14e7b-0ac8-4e37-8908-aa7a433cbb61',
        mockProfileTelephoneTransaction,
      );
      cy.intercept(
        'GET',
        '/v0/profile/status/e35c40cf-28d2-4618-8e28-ef422f2a7ebf',
        mockProfileEmailTransaction,
      );
      cy.intercept(
        'PUT',
        '/v0/in_progress_forms/FORM-MOCK-PREFILL',
        mockSipPut,
      );
      cy.intercept('PUT', '/v0/profile/telephones', mockProfileTelephones);
      cy.intercept('PUT', '/v0/profile/addresses', mockProfileAddresses);
      cy.intercept(
        'PUT',
        '/v0/profile/email_addresses',
        mockProfileEmailAddresses,
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
