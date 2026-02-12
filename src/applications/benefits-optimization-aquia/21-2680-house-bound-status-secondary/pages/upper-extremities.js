/**
 * @module pages/upper-extremities
 * @description Standard form system configuration for Upper Extremities page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects a description of restrictions for each upper extremity.
 */

import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Upper Extremities page
 * Textarea for describing upper extremity restrictions
 */
export const upperExtremitiesUiSchema = {
  'ui:title': 'Upper extremities',
  upperExtremities: textareaUI({
    title:
      'Describe restrictions of each upper extremity with particular reference to grip, fine movements, and ability to feed themselves, to button clothing, shave, and attend to the needs of nature',
    errorMessages: {
      required: 'A description of upper extremity restrictions is required',
    },
  }),
};

/**
 * JSON Schema for Upper Extremities page
 * Validates upper extremities description
 */
export const upperExtremitiesSchema = {
  type: 'object',
  required: ['upperExtremities'],
  properties: {
    upperExtremities: { type: 'string' },
  },
};
