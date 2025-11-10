/**
 * @module config/form/pages/veteran-identification-info
 * @description Standard form system configuration for Veteran Identification Info page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import {
  ssnUI,
  ssnSchema,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { isPatientVeteran } from './helpers';

/**
 * uiSchema for Veteran Identification Info page
 * Collects veteran SSN (preferred) or VA file number
 */
export const veteranIdentificationInfoUiSchema = {
  'ui:title': "Veteran's identification information",
  veteranIdentificationInfo: {
    veteranSsn: {
      ...ssnUI('Social Security number'),
      'ui:required': formData =>
        !formData?.veteranIdentificationInfo?.veteranVaFileNumber,
      'ui:errorMessages': {
        ...ssnUI('Social Security number')['ui:errorMessages'],
        required: 'Please enter a Social Security number or VA file number',
      },
    },
    veteranVaFileNumber: {
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
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const data = fullData || formData;
      const patientIsVeteran = isPatientVeteran(data);

      const subtitle = patientIsVeteran
        ? "You must enter the Veteran's Social Security number. You can also enter a VA file number if available."
        : 'You must enter either a Social Security number or VA File number for the Veteran who is connected to the patient';

      return {
        'ui:description': subtitle,
      };
    },
  },
};

/**
 * JSON Schema for Veteran Identification Info page
 * Validates veteran SSN and VA file number
 * Note: At least one ID is required, enforced by ui:required functions
 */
export const veteranIdentificationInfoSchema = {
  type: 'object',
  required: ['veteranIdentificationInfo'],
  properties: {
    veteranIdentificationInfo: {
      type: 'object',
      properties: {
        veteranSsn: ssnSchema,
        veteranVaFileNumber: {
          type: 'string',
          pattern: '^[0-9]{8,9}$',
        },
      },
    },
  },
};
