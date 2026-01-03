/**
 * @module config/form/pages/veteran-ssn
 * @description Standard form system configuration for Veteran SSN page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getVeteranName } from '@bio-aquia/21-2680-house-bound-status/utils/name-helpers';

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
      const veteranName = getVeteranName(data, 'Veteran');
      return {
        'ui:title': `${veteranName}'s Social Security number`,
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
