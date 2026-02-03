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
    createMockTransactionResponse('COMPLETED_SUCCESS'),
  ).as('updateSchedulingPreferencesSuccess');

  cy.intercept(
    'DELETE',
    '/v0/profile/scheduling_preferences',
    createMockTransactionResponse('COMPLETED_SUCCESS'),
  ).as('deleteSchedulingPreferencesSuccess');

  cy.visit(PROFILE_PATHS.SCHEDULING_PREFERENCES);
  cy.wait('@mockSchedulingPreferences');
};

const clickEdit = () => {
  // Click edit button in the preferred select a time section to enter edit view
  cy.get(
    '#edit-when-do-you-want-us-to-contact-you-to-schedule-your-appointments',
  ).click();
};

const selectPreferredOption = option => {
  cy.get('va-radio[name="preferredContactTimes"]')
    .find(`input[type="radio"][value="${option}"]`)
    .check();
};

const selectTimes = times => {
  times.forEach(time => {
    cy.get(`va-checkbox[name="preferredContactTimes"][value="${time}"]`)
      .shadow()
      .find(`input[type="checkbox"]`)
      .check();
  });
};

const clickContinueCancelButton = () => {
  // Click to continue to confirm page
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findByTestId('continue-cancel-buttons')
    .shadow()
    .find('va-button')
    .should('be.visible')
    .first()
    .shadow()
    .find('button')
    .should('be.visible')
    .click();
};

const clickSaveToProfile = () => {
  // Click to save on the confirm page
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.findByTestId('save-cancel-buttons')
    .shadow()
    .find('va-button')
    .should('be.visible')
    .first()
    .shadow()
    .find('button')
    .should('be.visible')
    .click();
};

describe('Scheduling preferences time selection', () => {
  beforeEach(() => {
    setup();
  });

  context('select preferred times', () => {
    const quickExitTests = [
      {
        label: 'should allow selection of no preference',
        option: 'option-17',
        expectedText: /No preference/i,
      },
    ];

    quickExitTests.forEach(({ label, option, expectedText }) => {
      it(label, () => {
        // Select a time preference and click Save to profile to bypass confirm page
        clickEdit();
        selectPreferredOption(option);

        // Click to save via quick exit
        clickSaveToProfile();

        // Wait for the API call to complete
        cy.wait('@updateSchedulingPreferencesSuccess');

        // Confirm remove button is visible which only shows when a time is selected
        cy.get(
          '#remove-when-do-you-want-us-to-contact-you-to-schedule-your-appointments',
        ).should('be.visible');

        cy.findByText(expectedText).should('exist');

        cy.injectAxeThenAxeCheck();
      });
    });

    const selectTimesTests = [
      {
        label: 'should allow selection of both Monday times',
        options: ['option-7', 'option-8'],
        expectedText: /Monday: morning or afternoon/i,
      },
      {
        label: 'should allow selection of Tuesday morning',
        options: ['option-9'],
        expectedText: /Tuesday: morning/i,
      },
      {
        label: 'should allow selection of Wednesday afternoon',
        options: ['option-12'],
        expectedText: /Wednesday: afternoon/i,
      },
      {
        label: 'should allow selection of all days and times',
        options: [
          'option-7',
          'option-8',
          'option-9',
          'option-10',
          'option-11',
          'option-12',
          'option-13',
          'option-14',
          'option-15',
          'option-16',
        ],
        expectedText: [
          /Monday: morning or afternoon/i,
          /Tuesday: morning or afternoon/i,
          /Wednesday: morning or afternoon/i,
          /Thursday: morning or afternoon/i,
          /Friday: morning or afternoon/i,
        ],
      },
    ];

    selectTimesTests.forEach(({ label, options, expectedText }) => {
      it(label, () => {
        // Select a set of time preferences and click Save to profile
        clickEdit();
        selectPreferredOption('continue');

        // Click to continue to confirm page
        clickContinueCancelButton();

        selectTimes(options);

        clickSaveToProfile();

        // Wait for the API call to complete
        cy.wait('@updateSchedulingPreferencesSuccess');

        if (Array.isArray(expectedText)) {
          expectedText.forEach(text => {
            cy.findByText(text).should('exist');
          });
        } else {
          cy.findByText(expectedText).should('exist');
        }

        cy.injectAxeThenAxeCheck();
      });
    });
    it('should show an error when no overall preference is selected', () => {
      // Select a set of time preferences and click Save to profile
      clickEdit();

      // Click to continue to confirm page
      clickContinueCancelButton();

      cy.get('va-radio')
        .shadow()
        .findByText(/Select a scheduling preference/i)
        .should('exist');

      cy.injectAxeThenAxeCheck();
    });

    it('should show an error when no times are selected', () => {
      // Select a set of time preferences and click Save to profile
      clickEdit();
      selectPreferredOption('continue');

      // Click to continue to confirm page
      clickContinueCancelButton();

      clickSaveToProfile();

      cy.get('va-checkbox-group')
        .shadow()
        .findByText(/Select a scheduling preference/i)
        .should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });
  context('cancel button', () => {
    it('should allow canceling out of edit flow', () => {
      // Click edit button in the preferred select a time section to enter edit view
      clickEdit();

      // Click to cancel
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.findByTestId('continue-cancel-buttons')
        .shadow()
        .find('va-button')
        .should('be.visible')
        .last()
        .shadow()
        .find('button')
        .should('be.visible')
        .click();

      // Confirm we are back on the scheduling preferences main page
      cy.url().should(
        'eq',
        `${Cypress.config().baseUrl}${PROFILE_PATHS.SCHEDULING_PREFERENCES}`,
      );

      cy.injectAxeThenAxeCheck();
    });
  });

  context('error handling', () => {
    it('should show an error message when the API call fails', () => {
      // Mock POST request to return API error response
      cy.intercept('POST', '/v0/profile/scheduling_preferences', {
        statusCode: 500,
        body: {},
      }).as('updateSchedulingPreferencesError');

      // Select no preference and click save
      clickEdit();
      selectPreferredOption('option-17');
      clickSaveToProfile();

      // Wait for the API call to complete
      cy.wait('@updateSchedulingPreferencesError');

      // Confirm error message is shown
      cy.findByText(/We’re sorry./i).should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  context('remove preference', () => {
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
        .should('be.visible')
        .first()
        .shadow()
        .find('button')
        .should('be.visible')
        .click();

      // Confirm that the preference has been removed
      cy.findByText(/Update saved./i).should('exist');

      cy.injectAxeThenAxeCheck();
    });
  });

  context('confirm cancel modal fires correctly', () => {
    it('should show modal when exiting a modified page via breadcrumb link', () => {
      // Click edit button in the preferred contact method section to enter edit view
      clickEdit();

      selectPreferredOption('option-17');

      // Attempt to navigate away
      cy.get('va-link[back]')
        .shadow()
        .find('a')
        .click();

      // Confirm that the confirm cancel modal is shown
      cy.findByTestId('edit-confirm-cancel-modal').should('exist');

      // Close the modal
      cy.findByTestId('edit-confirm-cancel-modal')
        .shadow()
        .find('va-button')
        .should('be.visible')
        .first()
        .shadow()
        .find('button')
        .should('be.visible')
        .click();

      // Confirm we are back on the scheduling preferences main page
      cy.url().should(
        'eq',
        `${Cypress.config().baseUrl}${PROFILE_PATHS.SCHEDULING_PREFERENCES}`,
      );

      cy.injectAxeThenAxeCheck();
    });

    it('should not show modal when exiting an unmodified page via breadcrumb link', () => {
      // Click edit button in the preferred contact method section to enter edit view
      clickEdit();

      // Attempt to navigate away
      cy.get('va-link[back]')
        .shadow()
        .find('a')
        .click();

      // Confirm that the confirm cancel modal is shown
      cy.findByTestId('edit-confirm-cancel-modal').should('not.exist');

      // Confirm we are back on the scheduling preferences main page
      cy.url().should(
        'eq',
        `${Cypress.config().baseUrl}${PROFILE_PATHS.SCHEDULING_PREFERENCES}`,
      );

      cy.injectAxeThenAxeCheck();
    });
    it('should show modal when exiting a modified page via cancel button', () => {
      // Click edit button in the preferred contact method section to enter edit view
      clickEdit();

      selectPreferredOption('option-17');

      // Attempt to navigate away
      cy.findByTestId('save-cancel-buttons')
        .shadow()
        .find('va-button')
        .should('be.visible')
        .last()
        .shadow()
        .find('button')
        .should('be.visible')
        .click();

      // Confirm that the confirm cancel modal is shown
      cy.findByTestId('edit-confirm-cancel-modal').should('exist');

      // Close the modal
      cy.findByTestId('edit-confirm-cancel-modal')
        .shadow()
        .find('va-button')
        .should('be.visible')
        .first()
        .shadow()
        .find('button')
        .should('be.visible')
        .click();

      // Confirm we are back on the scheduling preferences main page
      cy.url().should(
        'eq',
        `${Cypress.config().baseUrl}${PROFILE_PATHS.SCHEDULING_PREFERENCES}`,
      );

      cy.injectAxeThenAxeCheck();
    });

    it('should not show modal when exiting an unmodified page via cancel button', () => {
      // Click edit button in the preferred contact method section to enter edit view
      clickEdit();

      // Attempt to navigate away
      cy.findByTestId('continue-cancel-buttons')
        .shadow()
        .find('va-button')
        .should('be.visible')
        .last()
        .shadow()
        .find('button')
        .should('be.visible')
        .click();

      // Confirm that the confirm cancel modal is shown
      cy.findByTestId('edit-confirm-cancel-modal').should('not.exist');

      // Confirm we are back on the scheduling preferences main page
      cy.url().should(
        'eq',
        `${Cypress.config().baseUrl}${PROFILE_PATHS.SCHEDULING_PREFERENCES}`,
      );

      cy.injectAxeThenAxeCheck();
    });
    it('should show modal when exiting a modified page via browser back button', () => {
      // Click edit button in the preferred contact method section to enter edit view
      clickEdit();

      selectPreferredOption('option-17');

      // Attempt to navigate away
      cy.go('back');

      // Confirm that the confirm cancel modal is shown
      cy.findByTestId('edit-confirm-cancel-modal').should('exist');

      // Close the modal
      cy.findByTestId('edit-confirm-cancel-modal')
        .shadow()
        .find('va-button')
        .should('be.visible')
        .first()
        .shadow()
        .find('button')
        .should('be.visible')
        .click();

      // Confirm we are back on the scheduling preferences main page
      cy.url().should(
        'eq',
        `${Cypress.config().baseUrl}${PROFILE_PATHS.SCHEDULING_PREFERENCES}`,
      );

      cy.injectAxeThenAxeCheck();
    });

    it('should not show modal when exiting an unmodified page via browser back button', () => {
      // Click edit button in the preferred contact method section to enter edit view
      clickEdit();

      // Attempt to navigate away
      cy.go('back');

      // Confirm that the confirm cancel modal is shown
      cy.findByTestId('edit-confirm-cancel-modal').should('not.exist');

      // Confirm we are back on the scheduling preferences main page
      cy.url().should(
        'eq',
        `${Cypress.config().baseUrl}${PROFILE_PATHS.SCHEDULING_PREFERENCES}`,
      );

      cy.injectAxeThenAxeCheck();
    });
  });
});
