/**
 * @module config/form/pages/medicaid-application
 * @description Standard form system configuration for Medicaid Application page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Medicaid Application page
 * Determines if patient has applied for Medicaid
 */
export const medicaidApplicationUiSchema = {
  medicaidApplication: {
    hasAppliedForMedicaid: yesNoUI({
      title: 'Has the patient applied for Medicaid?',
    }),
  },
};

/**
 * JSON Schema for Medicaid Application page
 * Validates Medicaid application status
 */
export const medicaidApplicationSchema = {
  type: 'object',
  required: ['medicaidApplication'],
  properties: {
    medicaidApplication: {
      type: 'object',
      required: ['hasAppliedForMedicaid'],
      properties: {
        hasAppliedForMedicaid: yesNoSchema,
      },
    },
  },
};
