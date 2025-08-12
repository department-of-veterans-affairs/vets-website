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

// Export all constants
export { TIMEOUTS, MODAL_STATES, SELECTORS } from './constants';

// Export navigation helpers
export {
  clickBack,
  clickContinue,
  navigateThroughPages,
  navigateToToxicExposureConditions,
  skipWizard,
  startApplication,
  waitForPageNavigation,
} from './navigation';

// Export form interaction helpers
export {
  checkCheckbox,
  fillConditionFollowUp,
  fillServicePeriod,
  fillTextarea,
  fillTextInput,
  selectDropdownOption,
  selectNo,
  selectRadioByValue,
  selectRadioOption,
  selectYes,
  uncheckCheckbox,
} from './form-interactions';

// Export VA component helpers
export {
  clickModalButton,
  interactWithVAComponent,
  verifyAlert,
  verifyModalContent,
  verifyModalVisibility,
  verifyVACheckboxState,
} from './components';

// Export disability-specific helpers
export { addDisabilityCondition } from './disability-helpers';

// Export mocking helpers
export { setupStandardMocks } from './mocking';

// Export assertion helpers
export { verifyTextExists } from './assertions';

// Import all for rtlHelpers namespace
import { TIMEOUTS, MODAL_STATES, SELECTORS } from './constants';
import {
  clickBack,
  clickContinue,
  navigateThroughPages,
  navigateToToxicExposureConditions,
  skipWizard,
  startApplication,
  waitForPageNavigation,
} from './navigation';
import {
  checkCheckbox,
  fillConditionFollowUp,
  fillServicePeriod,
  fillTextarea,
  fillTextInput,
  selectDropdownOption,
  selectNo,
  selectRadioByValue,
  selectRadioOption,
  selectYes,
  uncheckCheckbox,
} from './form-interactions';
import {
  clickModalButton,
  interactWithVAComponent,
  verifyAlert,
  verifyModalContent,
  verifyModalVisibility,
  verifyVACheckboxState,
} from './components';
import { addDisabilityCondition } from './disability-helpers';
import { setupStandardMocks } from './mocking';
import { verifyTextExists } from './assertions';

// Export rtlHelpers namespace for convenience
export const rtlHelpers = {
  // Constants
  TIMEOUTS,
  MODAL_STATES,
  SELECTORS,
  // Navigation
  clickBack,
  clickContinue,
  navigateThroughPages,
  navigateToToxicExposureConditions,
  skipWizard,
  startApplication,
  waitForPageNavigation,
  // Form interactions
  checkCheckbox,
  fillConditionFollowUp,
  fillServicePeriod,
  fillTextarea,
  fillTextInput,
  selectDropdownOption,
  selectNo,
  selectRadioByValue,
  selectRadioOption,
  selectYes,
  uncheckCheckbox,
  // VA components
  clickModalButton,
  interactWithVAComponent,
  verifyAlert,
  verifyModalContent,
  verifyModalVisibility,
  verifyVACheckboxState,
  // Disability helpers
  addDisabilityCondition,
  // Mocking
  setupStandardMocks,
  // Assertions
  verifyTextExists,
};
