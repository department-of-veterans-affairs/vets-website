/**
 * @module config/form/pages/medicaid-start-date
 * @description Standard form system configuration for Medicaid Start Date page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import {
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Medicaid Start Date page
 * Collects the date patient's Medicaid coverage began
 */
export const medicaidStartDateUiSchema = {
  medicaidStartDate: {
    medicaidStartDate: currentOrPastDateUI({
      title: "When did the patient's Medicaid plan begin?",
    }),
  },
};

/**
 * JSON Schema for Medicaid Start Date page
 * Validates Medicaid start date
 */
export const medicaidStartDateSchema = {
  type: 'object',
  required: ['medicaidStartDate'],
  properties: {
    medicaidStartDate: {
      type: 'object',
      required: ['medicaidStartDate'],
      properties: {
        medicaidStartDate: currentOrPastDateSchema,
      },
    },
  },
};
