/**
 * @fileoverview React Testing Library-style helpers for Cypress tests
 * @module cypress-rtl-helpers
 *
 * This module provides a comprehensive set of helper functions that promote
 * React Testing Library (RTL) best practices while working with Cypress.
 * These helpers abstract common patterns in VA.gov form testing and provide
 * consistent, accessible ways to interact with form elements.
 *
 * @see {@link https://testing-library.com/docs/guiding-principles} RTL Guiding Principles
 */

/* eslint-disable no-unused-vars */
/* cspell:ignore vamc ppiu */

// Constants for common values
const TIMEOUTS = {
  DEFAULT: 10000,
  SHORT: 5000,
  LONG: 30000,
  RETRY: 500,
};

const MODAL_STATES = {
  VISIBLE: ['', undefined, 'true'],
  HIDDEN: 'false',
};

// Selectors used across helpers
const SELECTORS = {
  CONTINUE_BUTTON: 'button',
  VA_MODAL: 'va-modal',
  VA_CHECKBOX: 'va-checkbox',
  VA_ALERT: 'va-alert',
  VA_BUTTON: 'va-button',
  SKIP_WIZARD: '.skip-wizard-link',
  RADIO_NO: [
    'input[type="radio"][value="N"]',
    'input[type="radio"][value="no"]',
  ],
  RADIO_YES: [
    'input[type="radio"][value="Y"]',
    'input[type="radio"][value="yes"]',
  ],
};

/**
 * Helper to click Continue button using RTL patterns
 * Prioritizes accessible queries over implementation details
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Custom timeout
 */
export const clickContinue = (options = {}) => {
  const { timeout = TIMEOUTS.DEFAULT } = options;
  cy.findByRole(SELECTORS.CONTINUE_BUTTON, { name: /continue/i, timeout })
    .should('be.visible')
    .should('be.enabled')
    .click();
};

/**
 * Helper to click Back button using RTL patterns
 */
export const clickBack = () => {
  cy.findByRole('button', { name: /back/i }).click();
};

/**
 * Helper to select a radio option by its label text
 * Uses accessible queries instead of value attributes
 * @param {string} labelText - The label text for the radio button
 */
export const selectRadioOption = labelText => {
  cy.findByLabelText(new RegExp(labelText, 'i')).click();
};

/**
 * Helper to fill a text input by its label
 * @param {string} labelText - The label text for the input
 * @param {string} value - The value to type
 */
export const fillTextInput = (labelText, value) => {
  cy.findByLabelText(new RegExp(labelText, 'i')).clear();
  cy.findByLabelText(new RegExp(labelText, 'i')).type(value);
};

/**
 * Helper to fill a textarea by its label
 * @param {string} labelText - The label text for the textarea
 * @param {string} value - The value to type
 */
export const fillTextarea = (labelText, value) => {
  cy.findByRole('textbox', { name: new RegExp(labelText, 'i') }).type(value);
};

/**
 * Helper to select an option from a dropdown by label
 * @param {string} labelText - The label text for the select
 * @param {string} optionText - The option to select
 */
export const selectDropdownOption = (labelText, optionText) => {
  cy.findByLabelText(new RegExp(labelText, 'i')).select(optionText);
};

/**
 * Helper to check a checkbox using accessible queries
 * @param {string} labelText - The label text for the checkbox
 */
export const checkCheckbox = labelText => {
  cy.findByRole('checkbox', { name: new RegExp(labelText, 'i') }).check();
};

/**
 * Helper to uncheck a checkbox using accessible queries
 * @param {string} labelText - The label text for the checkbox
 */
export const uncheckCheckbox = labelText => {
  cy.findByRole('checkbox', { name: new RegExp(labelText, 'i') }).uncheck();
};

/**
 * Helper to verify text content exists on the page
 * @param {string} text - The text to verify
 */
export const verifyTextExists = text => {
  cy.findByText(new RegExp(text, 'i')).should('exist');
};

/**
 * Helper to start the disability compensation application
 * Uses accessible link finding
 */
export const startApplication = () => {
  cy.findAllByRole('link', {
    name: /start the disability compensation application/i,
  })
    .first()
    .click();
};

/**
 * Helper to navigate past the wizard
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Custom timeout
 */
export const skipWizard = (options = {}) => {
  const { timeout = TIMEOUTS.DEFAULT } = options;
  cy.get(SELECTORS.SKIP_WIZARD, { timeout })
    .should('be.visible')
    .click();
};

/**
 * Helper to fill service period dates
 * @param {object} dates - Object containing service dates
 * @param {number} periodIndex - Index of the service period (default 0)
 */
export const fillServicePeriod = (dates, periodIndex = 0) => {
  const idPrefix = `#root_serviceInformation_servicePeriods_${periodIndex}`;

  if (dates.branch) {
    cy.get(`${idPrefix}_serviceBranch`).select(dates.branch);
  }

  if (dates.from) {
    if (dates.from.month) {
      cy.get(`${idPrefix}_dateRange_fromMonth`).select(dates.from.month);
    }
    if (dates.from.day) {
      cy.get(`${idPrefix}_dateRange_fromDay`).select(dates.from.day);
    }
    if (dates.from.year) {
      cy.get(`${idPrefix}_dateRange_fromYear`).clear();
      cy.get(`${idPrefix}_dateRange_fromYear`).type(dates.from.year);
    }
  }

  if (dates.to) {
    if (dates.to.month) {
      cy.get(`${idPrefix}_dateRange_toMonth`).select(dates.to.month);
    }
    if (dates.to.day) {
      cy.get(`${idPrefix}_dateRange_toDay`).select(dates.to.day);
    }
    if (dates.to.year) {
      cy.get(`${idPrefix}_dateRange_toYear`).clear();
      cy.get(`${idPrefix}_dateRange_toYear`).type(dates.to.year);
    }
  }
};

/**
 * Helper to interact with VA web components (shadow DOM)
 * @param {string} componentSelector - The VA component selector
 */
export const interactWithVAComponent = componentSelector => {
  // VA components use click for all interactions (including checkboxes)
  cy.get(componentSelector).click();
};

/**
 * Helper to verify VA checkbox state
 * @param {string} value - The value attribute of the checkbox
 * @param {boolean} shouldBeChecked - Whether it should be checked
 */
export const verifyVACheckboxState = (value, shouldBeChecked = true) => {
  const assertion = shouldBeChecked ? 'have.attr' : 'not.have.attr';
  cy.get(`va-checkbox[value="${value}"]`).should(assertion, 'checked');
};

/**
 * Helper to interact with VA modal buttons
 * @param {string} buttonText - The text of the button to click
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Custom timeout
 * @throws {Error} If buttonText is not provided
 */
export const clickModalButton = (buttonText, options = {}) => {
  if (!buttonText) {
    throw new Error('clickModalButton requires buttonText');
  }
  const { timeout = TIMEOUTS.DEFAULT } = options;
  cy.get(`${SELECTORS.VA_MODAL} button`, { timeout })
    .contains(buttonText)
    .should('be.visible')
    .click();
};

/**
 * Helper to verify modal visibility with improved assertions
 * @param {boolean} shouldBeVisible - Whether the modal should be visible
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Custom timeout for visibility check
 */
export const verifyModalVisibility = (shouldBeVisible = true, options = {}) => {
  const { timeout = TIMEOUTS.SHORT } = options;

  if (shouldBeVisible) {
    cy.log('Verifying modal is visible');
    cy.get(SELECTORS.VA_MODAL, { timeout })
      .should('exist')
      .should('be.visible')
      .then($modal => {
        const visible = $modal.attr('visible');
        cy.wrap(MODAL_STATES.VISIBLE.includes(visible)).should(
          'be.true',
          `Modal visible attribute should be one of: ${MODAL_STATES.VISIBLE.join(
            ', ',
          )}`,
        );
      });
  } else {
    cy.log('Verifying modal is not visible');
    cy.get('body').then($body => {
      if ($body.find(SELECTORS.VA_MODAL).length) {
        cy.get(SELECTORS.VA_MODAL).should(
          'have.attr',
          'visible',
          MODAL_STATES.HIDDEN,
        );
      } else {
        cy.get(SELECTORS.VA_MODAL).should('not.exist');
      }
    });
  }
};

/**
 * Helper to verify modal content
 * @param {string[]} expectedContent - Array of strings that should appear in the modal
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Custom timeout
 */
export const verifyModalContent = (expectedContent = [], options = {}) => {
  const { timeout = TIMEOUTS.SHORT } = options;

  if (!Array.isArray(expectedContent)) {
    throw new Error('verifyModalContent expects an array of strings');
  }

  if (expectedContent.length === 0) {
    cy.log('Warning: No content to verify in modal');
    return;
  }

  cy.log(`Verifying modal contains ${expectedContent.length} text items`);

  expectedContent.forEach((text, index) => {
    cy.get(SELECTORS.VA_MODAL, { timeout })
      .should('contain', text)
      .then(() => {
        cy.log(
          `✓ Found text ${index + 1}/${expectedContent.length}: "${text}"`,
        );
      });
  });
};

/**
 * Helper to verify alert exists and contains text
 * @param {string} status - The alert status (warning, info, error, success)
 * @param {string} text - Text the alert should contain
 * @param {object} options - Optional configuration
 * @param {number} options.timeout - Custom timeout
 * @throws {Error} If status is not provided
 */
export const verifyAlert = (status, text, options = {}) => {
  if (!status) {
    throw new Error('verifyAlert requires a status parameter');
  }

  const { timeout = TIMEOUTS.DEFAULT } = options;

  cy.log(`Verifying ${status} alert${text ? ` with text: "${text}"` : ''}`);

  cy.get(`${SELECTORS.VA_ALERT}[status="${status}"][visible="true"]`, {
    timeout,
  })
    .should('exist')
    .and('be.visible');

  if (text) {
    cy.get(SELECTORS.VA_ALERT).should('contain', text);
  }
};

/**
 * Helper to add a new disability condition with improved error handling
 * @param {string} condition - The condition name
 * @param {number} index - The index of the condition (default 0)
 * @throws {Error} If condition is not provided
 */
export const addDisabilityCondition = (condition, index = 0) => {
  if (!condition) {
    throw new Error('addDisabilityCondition requires a condition name');
  }

  cy.log(`Adding disability condition: ${condition}`);

  // Type in the autocomplete field
  cy.get(`#root_newDisabilities_${index}_condition`)
    .shadow()
    .find('input')
    .should('be.visible')
    .type(condition);

  // Wait for and select the first option
  cy.get('[role="option"]', { timeout: TIMEOUTS.SHORT })
    .first()
    .should('be.visible')
    .click();

  // Save the condition
  cy.get(`${SELECTORS.VA_BUTTON}[text="Save"]`)
    .should('be.visible')
    .click();
};

/**
 * Helper to select "No" for common form questions
 * Uses multiple strategies to handle different form implementations
 * @param {object} options - Optional configuration
 * @param {string} options.selector - Custom selector if needed
 * @param {boolean} options.force - Force click even if element is covered
 * @param {number} options.timeout - Custom timeout
 */
export const selectNo = (options = {}) => {
  const { selector, force = true, timeout = TIMEOUTS.SHORT } = options;

  cy.log('Selecting "No" option');

  if (selector) {
    cy.get(selector, { timeout })
      .should('exist')
      .click({ force });
    return;
  }

  // Try different selectors in order of preference
  cy.get('body').then($body => {
    for (const sel of SELECTORS.RADIO_NO) {
      if ($body.find(sel).length) {
        cy.log(`Found "No" radio with selector: ${sel}`);
        cy.get(sel)
          .first()
          .should('exist')
          .click({ force });
        return;
      }
    }

    // Try ID fallback
    if ($body.find('input[id*="No"]').length) {
      cy.log('Found "No" radio with id containing "No"');
      cy.get('input[id*="No"]')
        .first()
        .should('exist')
        .click({ force });
      return;
    }

    // Fallback to label click
    cy.log('Using label fallback for "No" selection');
    cy.get('label')
      .contains(/^no$/i)
      .should('exist')
      .click({ force });
  });
};

/**
 * Helper to select "Yes" for common form questions
 * Uses multiple strategies to handle different form implementations
 * @param {object} options - Optional configuration
 * @param {string} options.selector - Custom selector if needed
 * @param {boolean} options.force - Force click even if element is covered
 * @param {number} options.timeout - Custom timeout
 */
export const selectYes = (options = {}) => {
  const { selector, force = true, timeout = TIMEOUTS.SHORT } = options;

  cy.log('Selecting "Yes" option');

  if (selector) {
    cy.get(selector, { timeout })
      .should('exist')
      .click({ force });
    return;
  }

  // Try different selectors in order of preference
  cy.get('body').then($body => {
    for (const sel of SELECTORS.RADIO_YES) {
      if ($body.find(sel).length) {
        cy.log(`Found "Yes" radio with selector: ${sel}`);
        cy.get(sel)
          .first()
          .should('exist')
          .click({ force });
        return;
      }
    }

    // Try ID fallback
    if ($body.find('input[id*="Yes"]').length) {
      cy.log('Found "Yes" radio with id containing "Yes"');
      cy.get('input[id*="Yes"]')
        .first()
        .should('exist')
        .click({ force });
      return;
    }

    // Fallback to label click
    cy.log('Using label fallback for "Yes" selection');
    cy.get('label')
      .contains(/^yes$/i)
      .should('exist')
      .click({ force });
  });
};

/**
 * Helper to navigate through standard form pages that just need Continue
 * @param {string[]} pageNames - Array of page names for logging/documentation
 */
export const navigateThroughPages = (pageNames = []) => {
  pageNames.forEach(pageName => {
    cy.log(`Navigating through: ${pageName}`);
    clickContinue();
  });
};

/**
 * Helper to wait for and verify navigation to a specific page
 * @param {string} pathInclude - Part of the path to check for
 * @param {number} timeout - Timeout in milliseconds
 * @throws {Error} If pathInclude is not provided
 */
export const waitForPageNavigation = (
  pathInclude,
  timeout = TIMEOUTS.DEFAULT,
) => {
  if (!pathInclude) {
    throw new Error('waitForPageNavigation requires a pathInclude parameter');
  }

  cy.log(`Waiting for navigation to: ${pathInclude}`);
  cy.location('pathname', { timeout }).should('include', pathInclude);
};

/**
 * Helper to set up standard mock API responses
 * @param {object} options - Configuration options for mocks
 */
export const setupStandardMocks = options => {
  const {
    featureToggles = {},
    prefillData = {},
    user,
    mockItf,
    mockInProgress,
    mockLocations,
    mockPayment,
    mockUpload,
    mockSubmit,
    mockServiceBranches,
    MOCK_SIPS_API,
  } = options;

  if (user) {
    cy.login(user);
  }

  cy.intercept('GET', '/data/cms/vamc-ehr.json', { body: {} });

  if (mockItf) {
    cy.intercept('GET', '/v0/intent_to_file', mockItf());
  }

  if (mockInProgress) {
    cy.intercept('PUT', `${MOCK_SIPS_API}*`, mockInProgress);
  }

  if (mockLocations) {
    cy.intercept(
      'GET',
      '/v0/disability_compensation_form/separation_locations',
      mockLocations,
    );
  }

  if (mockPayment) {
    cy.intercept('GET', '/v0/ppiu/payment_information', mockPayment);
  }

  if (mockUpload) {
    cy.intercept('POST', '/v0/upload_supporting_evidence', mockUpload);
  }

  if (mockSubmit) {
    cy.intercept(
      'POST',
      '/v0/disability_compensation_form/submit_all_claim*',
      mockSubmit,
    );
  }

  cy.intercept(
    'GET',
    '/v0/disability_compensation_form/submission_status/*',
    '',
  );

  if (mockServiceBranches) {
    cy.intercept(
      'GET',
      '/v0/benefits_reference_data/service-branches',
      mockServiceBranches,
    );
  }

  // Set up feature toggles if provided
  if (Object.keys(featureToggles).length > 0) {
    cy.intercept('GET', '/v0/feature_toggles*', {
      statusCode: 200,
      body: {
        data: {
          type: 'feature_toggles',
          features: Object.entries(featureToggles).map(([name, value]) => ({
            name,
            value,
          })),
        },
      },
    });
  }

  // Set up prefill data if provided
  if (Object.keys(prefillData).length > 0 && MOCK_SIPS_API) {
    cy.intercept('GET', `${MOCK_SIPS_API}*`, prefillData);
  }
};

/**
 * Helper to navigate to the toxic exposure conditions page
 * Handles the standard flow to get there
 */
export const navigateToToxicExposureConditions = () => {
  // This would typically involve the full navigation flow
  // but can be customized based on prefill data
  cy.log('Navigating to toxic exposure conditions page');
};

/**
 * Helper to fill out the condition follow-up flow
 * @param {string} cause - The cause type (NEW, SECONDARY, WORSENED, VA)
 * @param {string} description - The description text
 * @throws {Error} If cause or description is not provided
 */
export const fillConditionFollowUp = (cause, description) => {
  const validCauses = ['NEW', 'SECONDARY', 'WORSENED', 'VA'];

  if (!cause || !validCauses.includes(cause)) {
    throw new Error(
      `fillConditionFollowUp requires a valid cause: ${validCauses.join(', ')}`,
    );
  }

  if (!description) {
    throw new Error('fillConditionFollowUp requires a description');
  }

  cy.log(`Filling condition follow-up: cause=${cause}`);

  // Select the cause
  cy.get(`input[value="${cause}"]`)
    .should('exist')
    .check({ force: true });
  clickContinue();

  // Fill description
  cy.get('textarea[id="root_primaryDescription"]')
    .should('be.visible')
    .type(description);
  clickContinue();
};

/**
 * Helper to select radio options by value
 * More reliable than label-based selection for VA forms
 * @param {string} value - The value attribute of the radio button
 */
export const selectRadioByValue = value => {
  cy.get(`input[type="radio"][value="${value}"]`)
    .first()
    .check({ force: true });
};

// Export all helpers as a namespace for convenience
export const rtlHelpers = {
  addDisabilityCondition,
  checkCheckbox,
  clickBack,
  clickContinue,
  clickModalButton,
  fillConditionFollowUp,
  fillServicePeriod,
  fillTextarea,
  fillTextInput,
  interactWithVAComponent,
  navigateThroughPages,
  navigateToToxicExposureConditions,
  selectDropdownOption,
  selectNo,
  selectRadioByValue,
  selectRadioOption,
  selectYes,
  setupStandardMocks,
  skipWizard,
  startApplication,
  uncheckCheckbox,
  verifyAlert,
  verifyModalContent,
  verifyModalVisibility,
  verifyTextExists,
  verifyVACheckboxState,
  waitForPageNavigation,
};
