/**
 * @module config/form/pages/claimant-ssn
 * @description Standard form system configuration for Claimant SSN page
 * VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid and Attendance
 */

import {
  ssnUI,
  ssnSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Claimant SSN page
 * Collects claimant's Social Security number
 */
export const claimantSsnUiSchema = {
  'ui:title': 'Claimant Social Security number',
  claimantSsn: {
    claimantSsn: ssnUI("Claimant's Social Security number"),
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
