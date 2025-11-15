/**
 * @module config/form/pages/veteran-identification-info
 * @description Standard form system configuration for Veteran Identification Info page
 * VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid and Attendance
 */

import {
  ssnOrVaFileNumberNoHintUI,
  ssnOrVaFileNumberNoHintSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import { isPatientVeteran } from '../utils';

/**
 * uiSchema for Veteran Identification Info page
 * Collects veteran SSN (preferred) or VA file number using platform pattern
 */
export const veteranIdentificationInfoUiSchema = {
  'ui:title': "Veteran's identification information",
  veteranIdentificationInfo: ssnOrVaFileNumberNoHintUI(),
  'ui:options': {
    updateUiSchema: (formData, fullData) => {
      const data = fullData || formData;
      const patientIsVeteran = isPatientVeteran(data);

      const subtitle = patientIsVeteran
        ? 'You must enter either a Social Security number or VA file number for the Veteran.'
        : 'You must enter either a Social Security number or VA file number for the Veteran who is connected to the patient';

      return {
        'ui:description': subtitle,
      };
    },
  },
};

/**
 * JSON Schema for Veteran Identification Info page
 * Uses platform pattern for SSN or VA file number validation
 * Note: At least one ID is required, enforced by platform's updateSchema
 */
export const veteranIdentificationInfoSchema = {
  type: 'object',
  required: ['veteranIdentificationInfo'],
  properties: {
    veteranIdentificationInfo: ssnOrVaFileNumberNoHintSchema,
  },
};
