/**
 * @module reducers/index
 * @description Redux reducer configuration for VA Form 21-2680
 */

import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config';

/**
 * Root reducer object for the application
 * Creates a form reducer with save-in-progress functionality
 *
 * @typedef {Object} RootReducer
 * @property {Function} form - Form reducer handling form state and save-in-progress
 */

/**
 * Redux reducer configuration
 * @type {RootReducer}
 */
export default {
  form: createSaveInProgressFormReducer(formConfig),
};
