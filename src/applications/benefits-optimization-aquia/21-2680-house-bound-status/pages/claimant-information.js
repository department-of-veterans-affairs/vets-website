/**
 * @module config/form/pages/claimant-information
 * @description Standard form system configuration for Claimant Information page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  fullNameUI,
  fullNameSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Claimant Information page
 * Collects claimant's full name and date of birth
 */
export const claimantInformationUiSchema = {
  'ui:title': 'Claimant information',
  claimantInformation: {
    claimantFullName: fullNameUI(),
    claimantDob: dateOfBirthUI("Claimant's date of birth"),
  },
};

/**
 * JSON Schema for Claimant Information page
 * Validates claimant identification fields
 */
export const claimantInformationSchema = {
  type: 'object',
  required: ['claimantInformation'],
  properties: {
    claimantInformation: {
      type: 'object',
      required: ['claimantFullName', 'claimantDob'],
      properties: {
        claimantFullName: fullNameSchema,
        claimantDob: dateOfBirthSchema,
      },
    },
  },
};
