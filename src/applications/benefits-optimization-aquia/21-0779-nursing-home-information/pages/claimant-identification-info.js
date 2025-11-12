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
 * Collects patient SSN (preferred) or VA file number when patient is spouse or parent
 */
export const claimantIdentificationInfoUiSchema = {
  'ui:title': "Patient's identification information",
  'ui:description':
    "You must enter the patient's Social Security number. You can also enter a VA file number if available.",
  claimantIdentificationInfo: {
    claimantSsn: {
      ...ssnUI('Social Security number'),
      'ui:required': formData =>
        !formData?.claimantIdentificationInfo?.claimantVaFileNumber,
      'ui:errorMessages': {
        ...ssnUI('Social Security number')['ui:errorMessages'],
        required: 'Please enter a Social Security number or VA file number',
      },
    },
    claimantVaFileNumber: {
      ...textUI({
        title: 'VA file number',
      }),
      'ui:options': {
        hideOnReview: false,
      },
      'ui:errorMessages': {
        pattern: 'VA file number must be 8 or 9 digits',
      },
    },
  },
};

/**
 * JSON Schema for Claimant Identification Info page
 * Validates patient SSN and VA file number
 * Note: At least one ID is required, enforced by ui:required functions
 */
export const claimantIdentificationInfoSchema = {
  type: 'object',
  required: ['claimantIdentificationInfo'],
  properties: {
    claimantIdentificationInfo: {
      type: 'object',
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
