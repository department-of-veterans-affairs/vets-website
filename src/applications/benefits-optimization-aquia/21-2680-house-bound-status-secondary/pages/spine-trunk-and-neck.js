/**
 * @module pages/spine-trunk-and-neck
 * @description Standard form system configuration for Spine, Trunk and Neck page
 * VA Form 21-2680 - House Bound Status (Medical Professional)
 *
 * Collects a description of restrictions of spine, trunk, and neck.
 */

import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Spine, Trunk and Neck page
 * Textarea for describing spine, trunk, and neck restrictions
 */
export const spineTrunkAndNeckUiSchema = {
  'ui:title': 'Spine, trunk and neck',
  spineTrunkAndNeck: textareaUI({
    title: 'Describe restrictions of spine, trunk, and neck',
    errorMessages: {
      required:
        'A description of spine, trunk, and neck restrictions is required',
    },
  }),
};

/**
 * JSON Schema for Spine, Trunk and Neck page
 * Validates spine, trunk, and neck description
 */
export const spineTrunkAndNeckSchema = {
  type: 'object',
  required: ['spineTrunkAndNeck'],
  properties: {
    spineTrunkAndNeck: { type: 'string' },
  },
};
