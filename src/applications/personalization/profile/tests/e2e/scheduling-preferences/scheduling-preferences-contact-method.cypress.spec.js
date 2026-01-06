import { PROFILE_PATHS } from '@@profile/constants';
import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import {
  mockFeatureToggles,
  mockGETEndpoints,
} from '@@profile/tests/e2e/helpers';

const setup = () => {
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
        {
          name: 'profile_scheduling_preferences',
          value: true,
        },
      ],
    },
  }));
  mockGETEndpoints([
    'v0/mhv_account',
    'v0/profile/full_name',
    'v0/profile/status',
    'v0/profile/personal_information',
    'v0/profile/service_history',
    'v0/profile/direct_deposits',
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
          preferences: [],
        },
      },
    },
  }).as('mockSchedulingPreferences');

  cy.visit(PROFILE_PATHS.SCHEDULING_PREFERENCES);
  cy.wait('@mockSchedulingPreferences');
};

const successResponseObject = {
  statusCode: 200,
  body: {
    data: {
      id: '',
      type: 'async_transaction_va_profile_scheduling_transactions',
      attributes: {
        transactionId: '94725087-d546-47e1-a247-f57ab0ed599c',
        transactionStatus: 'RECEIVED',
        type: 'AsyncTransaction::VAProfile::SchedulingTransaction',
        metadata: [],
      },
    },
  },
};

const interceptSchedulingPreferencesSuccess = () => {
  cy.intercept(
    'POST',
    '/v0/profile/scheduling_preferences',
    successResponseObject,
  ).as('updateSchedulingPreferencesSuccess');
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

const clickQuickExitSave = () => {
  // Click to save
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findByTestId('quick-exit-cancel-buttons')
    .shadow()
    .wait(1) // wait needed to ensure button is clickable for some reason
    .find('va-button')
    .first()
    .shadow()
    .find('button')
    .click();
};

const clickContinueCancelButton = () => {
  // Click to save
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findByTestId('continue-cancel-buttons')
    .shadow()
    .wait(1) // wait needed to ensure button is clickable for some reason
    .find('va-button')
    .first()
    .shadow()
    .find('button')
    .click();
};

const clickConfirmSave = () => {
  // Click to save
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findByTestId('confirm-update-buttons')
    .shadow()
    .wait(1) // wait needed to ensure button is clickable for some reason
    .find('va-button')
    .first()
    .shadow()
    .find('button')
    .click();
};

describe('Select preferred contact method', () => {
  beforeEach(() => {
    setup();
  });

  const quickExitTests = [
    {
      label: 'should allow selection of secured message',
      option: 'option-3',
      expectedText: /Secure message/i,
    },
    {
      label: 'should allow selection of no preference',
      option: 'option-6',
      expectedText: /No preference/i,
    },
  ];

  quickExitTests.forEach(({ label, option, expectedText }) => {
    it(label, () => {
      // Mock POST request to return API error response
      interceptSchedulingPreferencesSuccess();

      // Update the email address & click to save
      clickEdit();
      selectPreferredMethod(option);

      // Click to save via quick exit
      clickQuickExitSave();

      // Wait for the API call to complete
      cy.wait('@updateSchedulingPreferencesSuccess');

      // Confirm remove button is visible which only shows when a method is selected
      cy.get(
        '#remove-whats-the-best-way-to-contact-you-to-schedule-your-appointments',
      ).should('be.visible');

      cy.findByText(expectedText).should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  const confirmSaveTests = [
    {
      label: 'should allow selection of home phone',
      option: 'option-38',
      expectedText: /Phone call: home phone/i,
    },
    {
      label: 'should allow selection of mobile phone (call)',
      option: 'option-1',
      expectedText: /Phone call: mobile phone/i,
    },
    {
      label: 'should allow selection of mobile phone (text)',
      option: 'option-2',
      expectedText: /Text message: mobile phone/i,
    },
    {
      label: 'should allow selection of work phone',
      option: 'option-39',
      expectedText: /Phone call: work phone/i,
    },
    {
      label: 'should allow selection of mailing address',
      option: 'option-4',
      expectedText: /Mailing address/i,
    },
  ];

  confirmSaveTests.forEach(({ label, option, expectedText }) => {
    it(label, () => {
      // Mock POST request to return API error response
      interceptSchedulingPreferencesSuccess();

      // Update the email address & click to save
      clickEdit();
      selectPreferredMethod(option);

      // Click to continue to confirm page
      clickContinueCancelButton();

      clickConfirmSave();

      // Wait for the API call to complete
      cy.wait('@updateSchedulingPreferencesSuccess');

      cy.findByText(expectedText).should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });
});
