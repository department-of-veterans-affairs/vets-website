import { PROFILE_PATHS } from '@@profile/constants';
import mockUser from '@@profile/tests/fixtures/users/user-36.json';
import {
  createMockTransactionResponse,
  mockFeatureToggles,
  mockGETEndpoints,
} from '@@profile/tests/e2e/helpers';

const setup = (preferences = []) => {
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
    'DELETE',
    '/v0/profile/scheduling_preferences',
    createMockTransactionResponse('COMPLETED'),
  ).as('deleteSchedulingPreferencesSuccess');

  cy.visit(PROFILE_PATHS.SCHEDULING_PREFERENCES);
  cy.wait('@mockSchedulingPreferences');
};

const clickEdit = () => {
  // Click edit button in the preferred contact method section to enter edit view
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
  // Click to save bypassing the confirm page
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
  // Click to continue to confirm page
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
  // Click to save on the confirm page
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findByTestId('save-update-buttons')
    .shadow()
    .wait(1) // wait needed to ensure button is clickable for some reason
    .find('va-button')
    .first()
    .shadow()
    .find('button')
    .click();
};

describe('Scheduling preferences contact method - select preferred contact method', () => {
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
      // Select a contact method preference and click Save to profile to bypass confirm page
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
      confirmationText: /This is the home phone number we have on file for you./,
      expectedText: /Phone call: home phone/i,
    },
    {
      label: 'should allow selection of mobile phone (call)',
      option: 'option-1',
      confirmationText: /This is the mobile phone number we have on file for you./,
      expectedText: /Phone call: mobile phone/i,
    },
    {
      label: 'should allow selection of mobile phone (text)',
      option: 'option-2',
      confirmationText: /This is the mobile phone number we have on file for you./,
      expectedText: /Text message: mobile phone/i,
    },
    {
      label: 'should allow selection of work phone',
      option: 'option-39',
      confirmationText: /This is the work phone number we have on file for you./,
      expectedText: /Phone call: work phone/i,
    },
    {
      label: 'should allow selection of mailing address',
      option: 'option-4',
      confirmationText: /This is the mailing address we have on file for you./,
      expectedText: /Mailing address/i,
    },
  ];

  confirmSaveTests.forEach(
    ({ label, option, expectedText, confirmationText }) => {
      it(label, () => {
        // Select a contact method preference and click Continue to go to the confirm page
        clickEdit();
        selectPreferredMethod(option);

        // Click to continue to confirm page
        clickContinueCancelButton();

        cy.findByText(confirmationText).should('exist');

        clickConfirmSave();

        // Wait for the API call to complete
        cy.wait('@updateSchedulingPreferencesSuccess');

        cy.findByText(expectedText).should('exist');

        cy.injectAxeThenAxeCheck();
      });
    },
  );
});

describe('Scheduling preferences contact method - cancel button', () => {
  beforeEach(() => {
    setup();
  });

  it('should allow canceling out of edit flow', () => {
    // Click edit button in the preferred contact method section to enter edit view
    clickEdit();

    // Click to cancel
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.findByTestId('continue-cancel-buttons')
      .shadow()
      .wait(1) // wait needed to ensure button is clickable for some reason
      .find('va-button')
      .last()
      .shadow()
      .find('button')
      .click();

    // Confirm we are back on the scheduling preferences main page
    cy.url().should(
      'eq',
      `${Cypress.config().baseUrl}${PROFILE_PATHS.SCHEDULING_PREFERENCES}`,
    );

    cy.injectAxeThenAxeCheck();
  });
});

describe('Scheduling preferences contact method - error handling', () => {
  beforeEach(() => {
    setup();
  });

  it('should show an error message when the API call fails', () => {
    // Mock POST request to return API error response
    cy.intercept('POST', '/v0/profile/scheduling_preferences', {
      statusCode: 500,
      body: {},
    }).as('updateSchedulingPreferencesError');

    // Select no preference and click save
    clickEdit();
    selectPreferredMethod('option-6');
    clickQuickExitSave();

    // Wait for the API call to complete
    cy.wait('@updateSchedulingPreferencesError');

    // Confirm error message is shown
    cy.findByText(/We’re sorry./i).should('exist');

    cy.injectAxeThenAxeCheck();
  });
});

describe('Scheduling preferences contact method - remove preference', () => {
  beforeEach(() => {
    setup([
      {
        itemId: 1,
        optionIds: [3], // no preference
      },
    ]);
  });

  it('should show and allow preference to be removed', () => {
    cy.get(
      '#remove-whats-the-best-way-to-contact-you-to-schedule-your-appointments',
    ).click();

    cy.findByTestId('confirm-remove-modal').within(() => {
      cy.findByText(/This will remove your/i).should('exist');
    });

    cy.findByTestId('confirm-remove-modal')
      .shadow()
      .find('va-button')
      .first()
      .shadow()
      .find('button')
      .click();

    // Confirm that the preference has been removed
    cy.findByText(/Update saved./i).should('exist');

    cy.injectAxeThenAxeCheck();
  });
});
