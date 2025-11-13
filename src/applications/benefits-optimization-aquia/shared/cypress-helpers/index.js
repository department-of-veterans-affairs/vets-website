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
  back,
  next,
  navigateThrough,
  goToToxicExposure,
  skipWizard,
  startApp,
  waitForPath,
} from './navigation';

// Export form interaction helpers
export {
  check,
  fillCondition,
  fillService,
  fillTextarea,
  fillText,
  selectOption,
  selectNo,
  selectValue,
  selectRadio,
  selectYes,
  uncheck,
} from './form-interactions';

// Export VA component helpers
export {
  modalButton,
  clickVA,
  alertExists,
  modalContains,
  modalVisible,
  checkboxState,
} from './components';

// Export disability-specific helpers
export { addCondition } from './disability-helpers';

// Export mocking helpers
export { setupMocks } from './mocking';

// Export assertion helpers
export { textExists } from './assertions';

// Import all for rtlHelpers namespace
import { TIMEOUTS, MODAL_STATES, SELECTORS } from './constants';
import {
  back,
  next,
  navigateThrough,
  goToToxicExposure,
  skipWizard,
  startApp,
  waitForPath,
} from './navigation';
import {
  check,
  fillCondition,
  fillService,
  fillTextarea,
  fillText,
  selectOption,
  selectNo,
  selectValue,
  selectRadio,
  selectYes,
  uncheck,
} from './form-interactions';
import {
  modalButton,
  clickVA,
  alertExists,
  modalContains,
  modalVisible,
  checkboxState,
} from './components';
import { addCondition } from './disability-helpers';
import { setupMocks } from './mocking';
import { textExists } from './assertions';

// Export rtlHelpers namespace for convenience
export const rtlHelpers = {
  // Constants
  TIMEOUTS,
  MODAL_STATES,
  SELECTORS,
  // Navigation
  back,
  next,
  navigateThrough,
  goToToxicExposure,
  skipWizard,
  startApp,
  waitForPath,
  // Form interactions
  check,
  fillCondition,
  fillService,
  fillTextarea,
  fillText,
  selectOption,
  selectNo,
  selectValue,
  selectRadio,
  selectYes,
  uncheck,
  // VA components
  modalButton,
  clickVA,
  alertExists,
  modalContains,
  modalVisible,
  checkboxState,
  // Disability helpers
  addCondition,
  // Mocking
  setupMocks,
  // Assertions
  textExists,
};
