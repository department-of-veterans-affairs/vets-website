/**
 * @module config/form/pages/claimant-ssn
 * @description Standard form system configuration for Claimant SSN page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { getClaimantName } from '@bio-aquia/21-2680-house-bound-status/utils/name-helpers';

/**
 * uiSchema for Claimant SSN page
 * Collects claimant's Social Security number
 */
export const claimantSsnUiSchema = {
  claimantSsn: {
    claimantSsn: ssnUI('Social Security number'),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const data = fullData || formData;
      const claimantName = getClaimantName(data, 'Claimant');
      return {
        'ui:title': `${claimantName}'s Social Security number`,
      };
    },
  },
};

/**
 * JSON Schema for Claimant SSN page
 * Validates claimant SSN field
 */
export const claimantSsnSchema = {
  type: 'object',
  required: ['claimantSsn'],
  properties: {
    claimantSsn: {
      type: 'object',
      required: ['claimantSsn'],
      properties: {
        claimantSsn: ssnSchema,
      },
    },
  },
};
