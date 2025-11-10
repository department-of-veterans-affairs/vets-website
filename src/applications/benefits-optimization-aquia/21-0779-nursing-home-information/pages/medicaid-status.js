/**
 * @module config/form/pages/medicaid-status
 * @description Standard form system configuration for Medicaid Status page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Medicaid Status page
 * Determines if patient is currently covered by Medicaid
 */
export const medicaidStatusUiSchema = {
  medicaidStatus: {
    currentlyCoveredByMedicaid: yesNoUI({
      title:
        'Is the patient currently covered by Medicaid for nursing home care?',
    }),
  },
};

/**
 * JSON Schema for Medicaid Status page
 * Validates current Medicaid coverage status
 */
export const medicaidStatusSchema = {
  type: 'object',
  required: ['medicaidStatus'],
  properties: {
    medicaidStatus: {
      type: 'object',
      required: ['currentlyCoveredByMedicaid'],
      properties: {
        currentlyCoveredByMedicaid: yesNoSchema,
      },
    },
  },
};
