/**
 * @module reducers/reducers
 * @description Redux reducer configuration for VA Form 21-2680
 *
 * This module configures the Redux store for the 21-2680 form application,
 * providing state management for:
 * - Form data (veteran info, claimant info, hospitalization, etc.)
 * - Save-in-progress functionality (auto-save, session management)
 * - Form submission state and validation errors
 * - Prefill data from user profile
 *
 * @see {@link module:config/form} for form configuration
 * @see {@link https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/save-in-progress} Save-in-Progress documentation
 */

import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config';

/**
 * Root reducer configuration object
 *
 * @typedef {Object} ReducerConfig
 * @property {import('redux').Reducer} form - Form reducer with save-in-progress capabilities
 *   Manages form state including:
 *   - data: Current form data across all chapters and pages
 *   - pages: Page-specific state (visited, validation errors)
 *   - submission: Submission status and API response
 *   - savedStatus: Save-in-progress status and last saved timestamp
 *   - prefillStatus: Prefill data loading state
 */

/**
 * Redux reducer configuration for VA Form 21-2680
 *
 * Creates a save-in-progress form reducer that automatically handles:
 * - Form data persistence to backend
 * - Session timeout management
 * - Form data prefilling from user profile
 * - Submission state management
 *
 * @type {ReducerConfig}
 * @example
 * // Accessing form state in a component
 * const formData = useSelector(state => state.form.data);
 * const submission = useSelector(state => state.form.submission);
 */
export default {
  form: createSaveInProgressFormReducer(formConfig),
};
