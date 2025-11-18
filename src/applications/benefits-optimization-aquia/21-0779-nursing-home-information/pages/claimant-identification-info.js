/**
 * @module config/form/pages/claimant-identification-info
 * @description Standard form system configuration for Claimant Identification Info page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import {
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberNoHintSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/**
 * uiSchema for Claimant Identification Info page
 * Collects patient SSN or VA file number (either one is sufficient) when patient is spouse or parent
 */
export const claimantIdentificationInfoUiSchema = {
  'ui:title': "Patient's identification information",
  claimantIdentificationInfo: ssnOrVaFileNumberNoHintUI(),
  'ui:options': {
    updateUiSchema: () => ({
      'ui:description':
        'You must enter either a Social Security number or VA file number for the patient.',
    }),
  },
};

/**
 * JSON Schema for Claimant Identification Info page
 * Uses platform pattern for SSN or VA file number validation
 * Note: At least one ID is required, enforced by platform's updateSchema
 */
export const claimantIdentificationInfoSchema = {
  type: 'object',
  required: ['claimantIdentificationInfo'],
  properties: {
    claimantIdentificationInfo: ssnOrVaFileNumberNoHintSchema,
  },
};
