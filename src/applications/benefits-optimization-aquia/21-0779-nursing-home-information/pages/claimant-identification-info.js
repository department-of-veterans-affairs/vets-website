/**
 * @module config/form/pages/claimant-identification-info
 * @description Standard form system configuration for Claimant Identification Info page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import {
  ssnUI,
  ssnSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Claimant Identification Info page
 * Collects patient SSN and optional VA file number when patient is spouse or parent
 */
export const claimantIdentificationInfoUiSchema = {
  'ui:title': "Patient's identification information",
  'ui:description':
    "You must enter the patient's Social Security number. You can also enter a VA File number if available.",
  claimantIdentificationInfo: {
    claimantSsn: ssnUI('Social Security number'),
    claimantVaFileNumber: textUI({
      title: 'VA file number (optional)',
    }),
  },
  'ui:options': {
    updateUiSchema: () => {
      return {
        claimantIdentificationInfo: {
          claimantVaFileNumber: {
            'ui:description': 'The VA file number may be the same as their SSN',
          },
        },
      };
    },
  },
};

/**
 * JSON Schema for Claimant Identification Info page
 * Validates patient SSN and optional VA file number
 */
export const claimantIdentificationInfoSchema = {
  type: 'object',
  required: ['claimantIdentificationInfo'],
  properties: {
    claimantIdentificationInfo: {
      type: 'object',
      required: ['claimantSsn'],
      properties: {
        claimantSsn: ssnSchema,
        claimantVaFileNumber: {
          type: 'string',
          pattern: '^[0-9]{8,9}$',
        },
      },
    },
  },
};
