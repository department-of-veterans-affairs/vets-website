/**
 * @module config/form/pages/veteran-ssn
 * @description Standard form system configuration for Veteran SSN page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Veteran SSN page
 * Collects veteran's Social Security number
 */
export const veteranSsnUiSchema = {
  veteranInformation: {
    veteranSsn: ssnUI('Social Security number'),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const data = fullData || formData;
      const firstName = data?.veteranInformation?.veteranFullName?.first || '';
      const lastName = data?.veteranInformation?.veteranFullName?.last || '';
      const fullName = `${firstName} ${lastName}`.trim();
      const title = fullName
        ? `${fullName}'s Social Security number`
        : "Veteran's Social Security number";

      return {
        'ui:title': title,
      };
    },
  },
};

/**
 * JSON Schema for Veteran SSN page
 * Validates veteran SSN field
 */
export const veteranSsnSchema = {
  type: 'object',
  required: ['veteranInformation'],
  properties: {
    veteranInformation: {
      type: 'object',
      required: ['veteranSsn'],
      properties: {
        veteranSsn: ssnSchema,
      },
    },
  },
};
