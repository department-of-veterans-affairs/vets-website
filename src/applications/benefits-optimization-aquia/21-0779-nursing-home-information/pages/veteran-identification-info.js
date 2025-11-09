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
 * Collects veteran SSN and optional VA file number
 */
export const veteranIdentificationInfoUiSchema = {
  'ui:title': "Veteran's identification information",
  veteranIdentificationInfo: {
    veteranSsn: ssnUI('Social Security number'),
    veteranVaFileNumber: textUI({
      title: 'VA file number (optional)',
    }),
  },
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const data = fullData || formData;
      const patientIsVeteran = isPatientVeteran(data);

      const subtitle = patientIsVeteran
        ? 'You must enter either a Social Security number or VA File number'
        : 'You must enter either a Social Security number or VA File number for the Veteran who is connected to the patient';

      return {
        'ui:description': subtitle,
        veteranIdentificationInfo: {
          veteranVaFileNumber: {
            'ui:description': 'VA file number may be the same as SSN',
          },
        },
      };
    },
  },
};

/**
 * JSON Schema for Veteran Identification Info page
 * Validates veteran SSN and optional VA file number
 */
export const veteranIdentificationInfoSchema = {
  type: 'object',
  required: ['veteranIdentificationInfo'],
  properties: {
    veteranIdentificationInfo: {
      type: 'object',
      required: ['veteranSsn'],
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
