/**
 * @module config/form/pages/veteran-information
 * @description Standard form system configuration for Veteran Information page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  dateOfBirthUI,
  dateOfBirthSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Veteran Information page
 * Collects veteran's full name, SSN, and date of birth
 */
export const veteranInformationUiSchema = {
  'ui:title': 'Veteran information',
  'ui:description':
    'Confirm the personal information we have on file for the Veteran.',
  veteranInformation: {
    veteranFullName: fullNameNoSuffixUI(),
    veteranSsn: ssnUI('Social Security number'),
    veteranDob: dateOfBirthUI(),
  },
};

/**
 * JSON Schema for Veteran Information page
 * Validates veteran identification fields
 */
export const veteranInformationSchema = {
  type: 'object',
  required: ['veteranInformation'],
  properties: {
    veteranInformation: {
      type: 'object',
      required: ['veteranFullName', 'veteranSsn', 'veteranDob'],
      properties: {
        veteranFullName: fullNameNoSuffixSchema,
        veteranSsn: ssnSchema,
        veteranDob: dateOfBirthSchema,
      },
    },
  },
};
