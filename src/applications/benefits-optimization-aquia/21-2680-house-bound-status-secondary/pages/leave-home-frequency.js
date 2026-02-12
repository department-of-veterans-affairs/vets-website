/**
 * @module pages/leave-home-frequency
 * @description Standard form system configuration for Leave Home Frequency page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects how often and under what circumstances the patient leaves home.
 */

import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Leave Home Frequency page
 * Textarea for describing how often the patient leaves home
 */
export const leaveHomeFrequencyUiSchema = {
  'ui:title': 'How often does the patient leave home?',
  leaveHomeFrequency: textareaUI({
    title:
      'How often per day or week and under what circumstances (to include the level of assistance required) is the patient able to leave the home or immediate premises.',
    hint: 'Describe',
    errorMessages: {
      required: 'This field is required',
    },
  }),
};

/**
 * JSON Schema for Leave Home Frequency page
 * Validates leave home frequency description
 */
export const leaveHomeFrequencySchema = {
  type: 'object',
  required: ['leaveHomeFrequency'],
  properties: {
    leaveHomeFrequency: { type: 'string' },
  },
};
