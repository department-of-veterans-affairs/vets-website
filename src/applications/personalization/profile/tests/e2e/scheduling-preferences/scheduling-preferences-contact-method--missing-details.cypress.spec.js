import { PROFILE_PATHS } from '@@profile/constants';
import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import {
  createMockTransactionResponse,
  mockFeatureToggles,
  mockGETEndpoints,
} from '@@profile/tests/e2e/helpers';
import { createAddressValidationResponse } from '../address-validation/addressValidation';

const setup = (preferences = []) => {
  // Modify the mock user to have no contact info details
  mockUser.data.attributes.vet360ContactInformation.homePhone = null;
  mockUser.data.attributes.vet360ContactInformation.mobilePhone = null;
  mockUser.data.attributes.vet360ContactInformation.workPhone = null;
  mockUser.data.attributes.vet360ContactInformation.email = null;
  mockUser.data.attributes.vet360ContactInformation.mailingAddress = null;
  cy.login(mockUser);

  mockFeatureToggles(() => ({
    data: {
      type: 'feature_toggles',
      features: [
        {
          name: 'profile_2_enabled',
          value: true,
        },
        {
          name: 'profile_health_care_settings_page',
          value: true,
        },
      ],
    },
  }));
  mockGETEndpoints([
    'v0/mhv_account',
    'v0/profile/full_name',
    'v0/profile/status/',
    'v0/profile/personal_information',
    'v0/profile/service_history',
    'v0/profile/direct_deposits',
    '/data/cms/vamc-ehr.json',
  ]);

  cy.intercept('GET', '/v0/user?*', {
    statusCode: 200,
    body: mockUser,
  }).as('finalUserRequest');

  cy.intercept('GET', '/v0/profile/scheduling_preferences', {
    statusCode: 200,
    body: {
      data: {
        type: 'schedulingPreferences',
        attributes: {
          preferences,
        },
      },
    },
  }).as('mockSchedulingPreferences');

  cy.intercept(
    'POST',
    '/v0/profile/scheduling_preferences',
    createMockTransactionResponse('COMPLETED'),
  ).as('updateSchedulingPreferencesSuccess');

  cy.intercept(
    'POST',
    '/v0/profile/telephones',
    createMockTransactionResponse('COMPLETED'),
  ).as('updateTelephonesSuccess');

  cy.intercept(
    'POST',
    '/v0/profile/addresses',
    createMockTransactionResponse('COMPLETED'),
  ).as('updateAddressesSuccess');

  cy.intercept(
    'POST',
    '/v0/profile/emails',
    createMockTransactionResponse('COMPLETED'),
  ).as('updateEmailsSuccess');

  cy.intercept('/v0/profile/address_validation', {
    statusCode: 200,
    body: createAddressValidationResponse('valid-address'),
  }).as('addressValidation');

  cy.intercept(
    'GET',
    '/v0/profile/status/mock-transaction-id',
    createMockTransactionResponse('COMPLETED'),
  ).as('getTransactionStatus');

  cy.visit(PROFILE_PATHS.SCHEDULING_PREFERENCES);
  cy.wait('@mockSchedulingPreferences');
};

const clickEdit = () => {
  // Click edit button in the contact email section to enter edit view
  cy.get(
    '#edit-whats-the-best-way-to-contact-you-to-schedule-your-appointments',
  ).click();
};

const selectPreferredMethod = method => {
  cy.get('va-select[name="preferredContactMethod"]')
    .shadow()
    .find('select')
    .select(method);
};

const clickContinueCancelButton = () => {
  // Click to continue to confirm page (which will redirect to edit page because details are missing)
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findByTestId('continue-cancel-buttons')
    .shadow()
    .wait(100) // wait needed to ensure button is clickable for some reason
    .find('va-button')
    .first()
    .shadow()
    .find('button')
    .click();
};

const clickSaveToProfile = () => {
  // Click to save
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findByTestId('save-edit-button')
    .shadow()
    .wait(1) // wait needed to ensure button is clickable for some reason
    .find('button')
    .click();
};

describe('Scheduling preferences contact method - select preferred contact method', () => {
  beforeEach(() => {
    setup();
  });

  const subTaskFlowForMissingDetails = [
    {
      label: 'should allow selection of home phone',
      option: 'option-38',
      editPageText: /Enter the home phone number you want to use for scheduling./,
      expectedText: /Phone call: home phone/i,
      relatedFieldName: 'homePhone',
    },
    {
      label: 'should allow selection of mobile phone (call)',
      option: 'option-1',
      editPageText: /Enter the mobile phone number you want to use for scheduling./,
      expectedText: /Phone call: mobile phone/i,
      relatedFieldName: 'mobilePhone',
    },
    {
      label: 'should allow selection of mobile phone (text)',
      option: 'option-2',
      editPageText: /Enter the mobile phone number you want to use for scheduling./,
      expectedText: /Text message: mobile phone/i,
      relatedFieldName: 'mobilePhone',
    },
    {
      label: 'should allow selection of work phone',
      option: 'option-39',
      editPageText: /Enter the work phone number you want to use for scheduling./,
      expectedText: /Phone call: work phone/i,
      relatedFieldName: 'workPhone',
    },
    // {
    //   label: 'should allow selection of mailing address',
    //   option: 'option-4',
    //   editPageText: /Enter the mailing address you want to use for scheduling./,
    //   expectedText: /Mailing address/i,
    //   relatedFieldName: 'mailingAddress',
    // },
  ];

  subTaskFlowForMissingDetails.forEach(
    ({ label, option, expectedText, editPageText, relatedFieldName }) => {
      it(label, () => {
        // Select a contact method preference and continue
        clickEdit();
        selectPreferredMethod(option);

        // Click to continue to confirm page
        clickContinueCancelButton();

        // Wait for the API call to complete
        // Preference is saved before updating the related contact info
        cy.wait('@updateSchedulingPreferencesSuccess');

        cy.url().should('include', PROFILE_PATHS.EDIT);
        cy.url().should('include', `fieldName=${relatedFieldName}`);

        cy.findByText(editPageText).should('exist');

        // Fill in the required contact info details
        switch (relatedFieldName) {
          case 'homePhone':
          case 'mobilePhone':
          case 'workPhone':
            cy.get('va-text-input[name="root_inputPhoneNumber"]')
              .shadow()
              .find('input')
              .type('5551234567');
            break;
          case 'mailingAddress':
            cy.get('va-text-input[name="root_addressLine1"]')
              .shadow()
              .find('input')
              .type('36320 Coronado Dr');
            cy.get('va-text-input[name="root_city"]')
              .shadow()
              .find('input')
              .type('Fremont');
            cy.get('va-select[name="root_stateCode"]')
              .shadow()
              .find('select')
              .select('MD');
            cy.get('va-text-input[name="root_zipCode"]')
              .shadow()
              .find('input')
              .type('94536');
            break;
          default:
            break;
        }

        clickSaveToProfile();

        // This should not be needed but the page doesn't redirect on save within
        // Cypress so this forces the browser back to scheduling preferences
        cy.get('va-link[back]')
          .should('exist')
          .click();

        cy.findByText(expectedText).should('exist');

        cy.injectAxeThenAxeCheck();
      });
    },
  );
});
