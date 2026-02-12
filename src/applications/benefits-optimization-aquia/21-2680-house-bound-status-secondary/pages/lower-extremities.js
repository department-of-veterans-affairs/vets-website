/**
 * @module pages/lower-extremities
 * @description Standard form system configuration for Lower Extremities page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects a description of restrictions for each lower extremity.
 */

import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Lower Extremities page
 * Textarea for describing lower extremity restrictions
 */
export const lowerExtremitiesUiSchema = {
  'ui:title': 'Lower extremities',
  lowerExtremities: textareaUI({
    title:
      'Describe restrictions of each lower extremity with particular reference to the extent of limitation of motion, atrophy, and contractures or other interference.',
    hint:
      'If indicated, comment specifically on weight bearing, balance and propulsion of each lower extremity.',
    errorMessages: {
      required: 'A description of lower extremity restrictions is required',
    },
  }),
};

/**
 * JSON Schema for Lower Extremities page
 * Validates lower extremities description
 */
export const lowerExtremitiesSchema = {
  type: 'object',
  required: ['lowerExtremities'],
  properties: {
    lowerExtremities: { type: 'string' },
  },
};
